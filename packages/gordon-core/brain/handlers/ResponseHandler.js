const ResponseSanitizer = require("../../cognition/facts/ResponseSanitizer");
const sanitizer = new ResponseSanitizer();

class ResponseHandler {
    async process(context) {
        if (typeof context.response === "string") {
            let cleaned = sanitizer.sanitize(context.response);

            if (cleaned === "[NO_REPLY]" || cleaned.startsWith("[NO_REPLY]")) {
                console.log("🛑 ResponseHandler: [NO_REPLY] rilevato, nessun messaggio verrà inviato.");
                context.response = null;
            } else {
                context.response = cleaned;
            }
        }

        return context;
    }
}

module.exports = ResponseHandler;
