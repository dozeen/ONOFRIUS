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

        // 3. Domanda
        if (text.includes("?")) {
            return { primary: TYPES.QUESTION, confidence: 0.95 };
        }

        // 4. Task / Promemoria
        if (text.includes("ricordami") || text.startsWith("ricorda ")) {
            return { primary: TYPES.TASK, confidence: 0.98 };
        }

        // 5. Evento
        if (text.match(/\b(domani|oggi|stasera|alle\s+\d+)/)) {
            return { primary: TYPES.EVENT, confidence: 0.90 };
        }

        // 6. Notizia / Evento del Mondo
        if (text.includes("terremoto") || text.includes("condoglianze") || text.includes("morto") || text.includes("papa") || text.includes("notizia") || text.includes("elezioni") || text.includes("incidente") || text.includes("scoperta")) {
            return { primary: TYPES.NEWS, confidence: 0.92 };
        }

        // 7. Fatto
        if (text.includes(" è ") || text.includes(" e'") || text.includes("sono")) {
            return { primary: TYPES.FACT, confidence: 0.70 };
        }

        // 8. Social / Emoji
        if (/😂|🤣|😅|😀|😛|👍|❤️/.test(text)) {
            return { primary: TYPES.SOCIAL, confidence: 0.80 };
        }

        return {
            primary: TYPES.UNKNOWN,
            confidence: 0.30
        };
    }
}

module.exports = MessageClassifier;
