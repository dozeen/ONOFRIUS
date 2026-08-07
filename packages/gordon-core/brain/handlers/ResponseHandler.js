const chatControl = require("../../chat/ChatControlManager");
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

                // Se non è una risposta di stato/sistema di controllo ("stop onofrius" / "start onofrius")
                const isControlMsg = cleaned.startsWith("🛑 Sistema ONOFRIUS disattivato") || cleaned.startsWith("✅ Sistema ONOFRIUS riattivato");

                if (chatId && !isControlMsg && chatControl.isFirstResponse(chatId)) {
                    console.log(`📌 ResponseHandler: Prima risposta per la chat [${chatId}]. Aggiunta intestazione.`);
                    cleaned = "Sistema ONOFRIUS operativo:\n\n" + cleaned;
                    chatControl.markAsSeen(chatId);
                }

                context.response = cleaned;
            }
        }

        return context;
    }
}

module.exports = ResponseHandler;
