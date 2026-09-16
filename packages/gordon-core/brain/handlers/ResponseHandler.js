const chatControl = require("../../chat/ChatControlManager");
const personality = require("../../personality/PersonalityEngine");
const ResponseSanitizer = require("../../cognition/facts/ResponseSanitizer");
const sanitizer = new ResponseSanitizer();

class ResponseHandler {
    async process(context) {
        if (context.responseBlocked) {
            context.response = null;
            return context;
        }

        if (typeof context.response === "string" && context.response.trim().length > 0) {
            let cleaned = sanitizer.sanitize(context.response);

            if (cleaned === "[NO_REPLY]" || cleaned.startsWith("[NO_REPLY]")) {
                console.log("🛑 ResponseHandler: [NO_REPLY] rilevato, nessun messaggio verrà inviato.");
                context.response = null;
            } else {
                const chatId = context.chatId || (context.event && context.event.chatId) || context.senderId;

                // 1. Sanitizzazione e Formattazione Personality Engine (GordonStyle)
                cleaned = personality.format(cleaned, context);

                // 2. Inserisce la frase finale obbligatoria per contatti LOCALES o NUOVI CLIENTE POTENZIALI
                if ((context.isLocales || context.isNewClient) && typeof cleaned === 'string' && cleaned.length > 0) {
                    const checkStr = cleaned.toUpperCase();
                    if (!checkStr.includes("L'OWNER VI CONTATTERÀ") && !checkStr.includes("L'OWNER VI CONTATTERA") && !checkStr.includes("TI FACCIO CONTATTARE")) {
                        cleaned = cleaned.trim() + "\n\nL'OWNER VI CONTATTERÀ IL PIÙ PRESTO POSSIBILE.";
                    }
                }

                // 3. Controllo prima risposta in chat
                const isControlMsg = cleaned.startsWith("🛑 Sistema ONOFRIUS disattivato") || cleaned.startsWith("✅ Sistema ONOFRIUS riattivato");

                if (chatId && !isControlMsg && chatControl.isFirstResponse(chatId)) {
                    chatControl.markAsSeen(chatId);
                }

                context.response = cleaned;
            }
        }

        return context;
    }
}

module.exports = ResponseHandler;
