const TYPES = require("./MessageType");

class MessageClassifier {
    static classify(message) {
        const text = (message.text || "").toLowerCase().trim();
        const msgType = message.type || "";

        // 1. Media specifici da WhatsApp
        if (msgType === "document") return { primary: TYPES.DOCUMENT, confidence: 0.98 };
        if (msgType === "ptt" || msgType === "audio") return { primary: TYPES.AUDIO, confidence: 0.98 };
        if (msgType === "sticker") return { primary: TYPES.STICKER, confidence: 0.98 };
        if (msgType === "image" || msgType === "video") return { primary: TYPES.MEDIA, confidence: 0.95 };

        // 2. URL e Social Media Link
        if (text.includes("http://") || text.includes("https://") || text.includes("www.")) {
            if (text.includes("youtube.com") || text.includes("youtu.be")) {
                return { primary: TYPES.YOUTUBE, confidence: 0.98 };
            }
            if (text.includes("tiktok.com")) {
                return { primary: TYPES.TIKTOK, confidence: 0.98 };
            }
            return { primary: TYPES.URL, confidence: 0.95 };
        }

        // 3. Saluto / Ritual
        if (text.match(/\b(buongiorno|buonasera|ciao|salve|hola|ehi|bentornato|buondì|buondi)\b/)) {
            return { primary: TYPES.GREETING, confidence: 0.96 };
        }

        // 4. Ringraziamento / Chiusura
        if (text.match(/\b(grazie|grazie mille|prego|figurati|a dopo|ci vediamo|buona giornata|buona serata)\b/)) {
            return { primary: TYPES.GRATITUDE, confidence: 0.95 };
        }

        // 5. Conferma
        if (text.match(/\b(ok|va bene|perfetto|d'accordo|certamente|capito|chiaro|esatto|ricevuto)\b/)) {
            return { primary: TYPES.CONFIRMATION, confidence: 0.95 };
        }

        // 6. Domanda
        if (text.includes("?") || text.match(/^(chi|cosa|come|dove|quando|perché|perche)\b/)) {
            return { primary: TYPES.QUESTION, confidence: 0.95 };
        }

        // 7. Task / Promemoria
        if (text.includes("ricordami") || text.startsWith("ricorda ")) {
            return { primary: TYPES.TASK, confidence: 0.98 };
        }

        // 8. Evento
        if (text.match(/\b(domani|oggi|stasera|alle\s+\d+)/)) {
            return { primary: TYPES.EVENT, confidence: 0.90 };
        }

        // 9. Tecnico / Codice / System
        if (text.match(/\b(bug|codice|build|err|errore|git|push|pull|script|server|node|python|kernel|whisper|ffmpeg|plugin)\b/)) {
            return { primary: TYPES.TECHNICAL, confidence: 0.94 };
        }

        // 10. Notizia / Evento del Mondo
        if (text.match(/\b(terremoto|condoglianze|morto|papa|notizia|elezioni|incidente|scoperta)\b/)) {
            return { primary: TYPES.NEWS, confidence: 0.92 };
        }

        // 11. Fatto / Dichiarazione
        if (text.includes(" è ") || text.includes(" e'") || text.includes("sono")) {
            return { primary: TYPES.FACT, confidence: 0.75 };
        }

        // 12. Social / Emoji
        if (/😂|🤣|😅|😀|😛|👍|❤️/.test(text)) {
            return { primary: TYPES.SOCIAL, confidence: 0.85 };
        }

        // 13. Conversazione Casual Naturale (Invece di Fallback Unknown 0.3)
        if (text.length > 0) {
            return { primary: TYPES.CASUAL, confidence: 0.85 };
        }

        return {
            primary: TYPES.UNKNOWN,
            confidence: 0.30
        };
    }
}

module.exports = MessageClassifier;
