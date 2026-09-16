const fs = require('fs');
const path = require('path');

/**
 * LocalesHandler.js
 * 
 * Gestisce l'interazione sia con:
 * 1. Clienti Fissi "LOCALES" (proprietari di ristoranti/locali salvati in agenda con tag locales)
 * 2. Potenziali Nuovi Clienti (numeri nuovi non presenti in agenda che contattano per eventi)
 * 
 * Raccoglie le informazioni chiave dell'evento:
 * - NOME DEL LOCALE / STRUTTURA (per i nuovi clienti)
 * - LA DATA (Giorno)
 * - PRANZO o SERA
 * - SAX (se è richiesto il SAX)
 * - EVENTUALI RICHIESTE
 * 
 * Registra la richiesta in intentions.json di Gordon3.
 */
class LocalesHandler {
    constructor() {
        this.intentionsFilePath = path.resolve(__dirname, '../../../memory/intentions/intentions.json');
    }

    isLocalesContact(context) {
        if (!context) return false;
        const rawName = context.contactName || context.senderName || context.contact?.name || context.identity?.displayName || '';
        const relationship = context.contact?.relationship || context.relationship || '';
        return (
            context.isLocales === true ||
            context.contact?.isLocales === true ||
            /locale(s)?/i.test(rawName) ||
            /locale(s)?/i.test(relationship)
        );
    }

    isNewPotentialClient(context) {
        if (!context || context.isOwner || context.isGroup) return false;
        if (this.isLocalesContact(context)) return false;

        const isUnknown = (
            context.contact?.source === 'unknown' ||
            context.contact?.relationship === 'unknown' ||
            context.relationship === 'unknown' ||
            !context.contact?.name ||
            context.contact?.name === 'Sconosciuto' ||
            context.contact?.name === context.sender
        );

        const text = (context.text || '').toLowerCase();
        const bookingKeywords = [
            'prenot', 'evento', 'serata', 'suonare', 'disponibil', 'costo', 'preventivo',
            'locale', 'ristorante', 'villa', 'festa', 'matrimonio', 'ingaggio', 'data', 'sax', 'dj'
        ];

        const isBookingQuery = bookingKeywords.some(kw => text.includes(kw));

        return isUnknown && isBookingQuery;
    }

    extractEventDetails(text, history) {
        const fullText = (history || [])
            .map(h => (h.text || '').toLowerCase())
            .concat([ (text || '').toLowerCase() ])
            .join(' ');

        // 1. Nome del Locale / Struttura
        let venueName = null;
        const venueMatch = fullText.match(/(?:locale|ristorante|struttura|villa|sala|club|pub|pizzeria|presso|da)\s+([a-z0-9à-öø-ÿ\s'\-]{3,30})/i);
        if (venueMatch) {
            venueName = venueMatch[1].trim();
        }

        // 2. Data (es. 25 luglio, sabato, domani, 10 agosto, ecc.)
        const dateMatch = fullText.match(/\b(\d{1,2}\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)|lunedì|lunedí|lunedi|martedì|martedi|mercoledì|mercoledi|giovedì|giovedi|venerdì|venerdi|sabato|domenica|domani|oggi|prossimo\s+\w+)\b/i);
        const date = dateMatch ? dateMatch[0].trim() : null;

        // 3. Pranzo o Sera
        let slot = null;
        if (/\b(pranzo|pranzi|mattina|pomeriggio)\b/i.test(fullText)) {
            slot = 'PRANZO';
        } else if (/\b(sera|serata|notte|cena|cene)\b/i.test(fullText)) {
            slot = 'SERA';
        }

        // 4. Sax
        let sax = null;
        if (/\b(sax|sassofono|sassofonista)\b/i.test(fullText)) {
            if (/\b(no\s+sax|senza\s+sax|solo\s+dj)\b/i.test(fullText)) {
                sax = 'NO SAX (Solo DJ)';
            } else {
                sax = 'SAX RICHIESTO';
            }
        } else if (/\b(dj|solo\s+dj|musica)\b/i.test(fullText)) {
            sax = 'NON SPECIFICATO / DA CONFERMARE';
        }

        // 5. Eventuali richieste
        let requests = null;
        const reqMatch = fullText.match(/(?:richiest[ae]|note|dettagli|orario|budget|locale|ristorante)[\s:]+([^\n\.]+)/i);
        if (reqMatch) {
            requests = reqMatch[1].trim();
        }

        return {
            venueName,
            date,
            slot,
            sax,
            requests,
            hasKeyInfo: !!(date || slot || sax || venueName)
        };
    }

    saveIntention(contactName, phone, details, isNewClient = false) {
        try {
            let intentions = [];
            const dir = path.dirname(this.intentionsFilePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (fs.existsSync(this.intentionsFilePath)) {
                const raw = fs.readFileSync(this.intentionsFilePath, 'utf8');
                intentions = JSON.parse(raw);
            }

            const prefix = isNewClient ? 'NUOVO POTENZIALE CLIENTE' : 'Cliente Fisso LOCALES';
            const content = `${prefix} (${contactName}) - Locale: ${details.venueName || 'Da specificare'}, Data: ${details.date || 'Da specificare'}, Fascia: ${details.slot || 'Da specificare'}, Sax: ${details.sax || 'Da specificare'}, Note: ${details.requests || 'Nessuna nota'}`;
            
            const exists = intentions.some(i => i.content === content && i.status === 'ACTIVE');
            if (!exists) {
                intentions.push({
                    id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                    content,
                    status: 'ACTIVE',
                    meta: {
                        source: isNewClient ? 'new_client_booking' : 'locales_booking',
                        contact: contactName,
                        phone: phone,
                        isNewClient,
                        details
                    },
                    timestamp: new Date().toISOString()
                });
                fs.writeFileSync(this.intentionsFilePath, JSON.stringify(intentions, null, 2), 'utf8');
                console.log(`📌 [LocalesHandler] Intenzione salvata [${prefix}]: ${contactName}`);
            }
        } catch (err) {
            console.error('❌ Errore durante il salvataggio dell\'intenzione Locales:', err.message);
        }
    }

    async process(context) {
        const isLocales = this.isLocalesContact(context);
        const isNewClient = this.isNewPotentialClient(context);

        if (!isLocales && !isNewClient) {
            return context;
        }

        if (isLocales) {
            console.log(`🏷️ [LocalesHandler] Cliente Fisso LOCALES rilevato: ${context.contactName || context.sender}`);
            context.isLocales = true;
            if (context.contact) {
                context.contact.isLocales = true;
                context.contact.relationship = 'locales';
            }
        } else if (isNewClient) {
            console.log(`🆕 [LocalesHandler] Potenziale NUOVO CLIENTE rilevato (numero non in agenda): ${context.sender}`);
            context.isNewClient = true;
        }

        const text = context.text || '';
        const history = context.history || [];
        const details = this.extractEventDetails(text, history);
        context.localesDetails = details;

        if (details.hasKeyInfo) {
            this.saveIntention(
                context.contactName || context.senderName || (isNewClient ? 'Nuovo Cliente' : 'Cliente Locales'),
                context.chatId || context.sender,
                details,
                isNewClient
            );
        }

        return context;
    }
}

module.exports = LocalesHandler;
