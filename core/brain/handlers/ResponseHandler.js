class ResponseHandler {

    async process(context) {

        if (typeof context.response === "string") {

            const cleaned = context.response.trim();

            if (cleaned === "[NO_REPLY]" || cleaned.startsWith("[NO_REPLY]")) {

                console.log("🛑 ResponseHandler: [NO_REPLY] rilevato, nessun messaggio verrà inviato.");

                context.response = null;

            }

        }

        return context;

    }

}

module.exports = ResponseHandler;
