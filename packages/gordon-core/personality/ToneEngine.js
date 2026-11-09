/**
 * ToneEngine.js - Rileva il Registro Relazionale (Romantic, Flirt, Ironic, Casual, Family, Technical, Business, Serious)
 * Evita di trasformare conversazioni affettive o scherzose in dialoghi professionali o assistenziali.
 * Favorisce spontaneità, calore e complicità nei contesti romantici/affettuosi (es. partner).
 */

class ToneEngine {
    evaluateTone(context) {
        const text = (context.text || (context.event && context.event.text) || "").toLowerCase().trim();
        const contactRel = (context.contact && context.contact.relationship) || (context.relationship || "").toLowerCase();
        const contactName = (context.contactName || (context.contact && context.contact.name) || context.senderName || "").toLowerCase();

        const contactProfile = (context.contact && (context.contact.profile || context.contact.relationship)) || "";
        const isRomanticContact = contactRel.includes("partner") || 
                                  contactRel.includes("amica_intima") || 
                                  contactRel.includes("moglie") || 
                                  contactRel.includes("fidanzata") || 
                                  contactRel.includes("flirt") || 
                                  contactRel.includes("romantic") ||
                                  String(contactProfile).toUpperCase().includes("INTIMATE");

        const contactType = (context.contact && context.contact.type) || "";
        const isFamilyContact = contactType === "family" || 
                                contactRel.includes("famiglia") || 
                                contactRel.includes("figlia") || 
                                contactRel.includes("figlio") || 
                                contactRel.includes("madre") || 
                                contactRel.includes("padre") || 
                                contactRel.includes("fratello") || 
                                contactRel.includes("sorella");

        // 1. Famiglia (ha precedenza per evitare che emoji affettuose dei figli vengano scambiate per flirt)
        if (isFamilyContact) {
            return {
                tone: "family",
                instruction: "Rispondi con affetto familiare, naturalezza, vicinanza spontanea, calmo e affettuoso. Se parli con tua figlia, sii un padre premuroso e supporta le sue passioni (come il sax e la musica)."
            };
        }

        // Keywords ed emoji romantiche/affettive estese
        const romanticWordsRegex = /\b(amore|amoredimamma|tesoro|cuore|vita|bacio|baci|smack|stelle|mancanza|mi manchi|innamorar|innamorat|dormire|notte|san lorenzo|cetaceo|festeggiare|sentirti|presenza|bimb|materasso|complicità|libertà|felicità|desider|adoro|dolce|bello|bacioni|coccol|abbracc|carezz|voglia di te)\b/;
        const romanticEmojiRegex = /(❤️|😘|😍|🥰|💖|😚|❤️‍🔥|💘|❣️|💕|💞|💓|💗|💋|🔥|✨|🤩|😉)/;

        // 2. Romantico / Intimo
        if (isRomanticContact || romanticWordsRegex.test(text) || romanticEmojiRegex.test(text)) {
            return {
                tone: "romantic",
                instruction: "Rispondi con complicità, calore, dolcezza e spontanea affettuosità. Puoi usare emoji o battute affettuose. Se l'interlocutrice è una donna/amica, usa forme al femminile e non attribuire mai appellativi maschili (come 'ragazzone'). Mantieni il tono aperto ed affettuoso, evitando qualsiasi rigidità o formalità."
            };
        }

        // 3. Ironico / Scherzoso
        if (text.match(/\b(ahah|huhu|scherz|battut|divert|bastardo|pirla|stronzo|cretino|😂|🤣|😅)\b/)) {
            return {
                tone: "ironic",
                instruction: "Rispondi con leggera ironia e complicità. Non spiegare la battuta e non cercare di essere utile a tutti i costi."
            };
        }

        // 4. Tecnico / Codice / System
        if (text.match(/\b(bug|codice|build|err|errore|git|push|pull|script|server|node|python|kernel|whisper|ffmpeg|plugin)\b/)) {
            return {
                tone: "technical",
                instruction: "Sii preciso, concreto ed orientato alla soluzione semplice senza lunghi discorsi."
            };
        }

        // 5. Business / Formale
        if (contactRel.includes("cliente") || contactRel.includes("lavoro") || contactRel.includes("azienda")) {
            return {
                tone: "business",
                instruction: "Rispondi in modo educato, sollecito e professionale."
            };
        }

        // 6. Casual / Naturale (Default)
        return {
            tone: "casual",
            instruction: "Rispondi come scriverebbe l'Owner su WhatsApp: calmo, diretto, spontaneo. Non cercare sempre di essere utile: se il messaggio è solo affettuoso, scherzoso o di cortesia, mantieni lo stesso tono."
        };
    }
}

module.exports = new ToneEngine();
