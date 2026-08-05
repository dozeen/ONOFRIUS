const bus = require("../../core/eventBus");

function registerReplyHandler(client) {
    bus.on("message.reply", async ({ context, response }) => {
        try {
            if (context.profiler) context.profiler.start("Dispatch");

            const destination = context.transport?.chatId || context.chatId || "";
            const lowerDest = String(destination).toLowerCase();

            if (!destination || lowerDest.includes("broadcast") || lowerDest.includes("newsletter")) {
                console.log(`🛑 ReplyHandler: Destinazione non valida per messaggi WhatsApp ('${destination}'). Inoltro annullato.`);
                return;
            }

            console.log("📤 Invio risposta...");
            console.log("➡ Destination:", destination);
            console.log("➡ Content:", response);

            await client.sendMessage(destination, response);

            if (context.profiler) {
                context.profiler.end("Dispatch");
                console.log(context.profiler.formatSummary());
            }

            console.log("✅ Risposta inviata su WhatsApp con successo");
        } catch (err) {
            console.error("❌ Invio fallito in replyHandler:", err.message);
        }
    });
}

module.exports = registerReplyHandler;
