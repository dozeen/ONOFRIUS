const bus = require("../../core/eventBus");
const { addRecentReply } = require("./recentReplies");
const History = require("../../core/history/history");
const contactManager = require("../../core/contactManager");
const history = new History();

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

            const fs = require("fs");
            console.log("📤 Invio risposta...");
            console.log("➡ Destination:", destination);
            console.log("➡ Content:", response);

            addRecentReply(response, destination);

            if (context.sendMediaFilePath && fs.existsSync(context.sendMediaFilePath)) {
                console.log("🖼️ Invio foto/media allegato:", context.sendMediaFilePath);
                const { MessageMedia } = require("whatsapp-web.js");
                const media = MessageMedia.fromFilePath(context.sendMediaFilePath);
                await client.sendMessage(destination, media, { caption: response || "" });
            } else {
                await client.sendMessage(destination, response);
            }

            // SALVA LA RISPOSTA NELLA CRONOLOGIA DELLA CHAT
            try {
                const normChatId = contactManager.normalize(context.chatId || destination);
                await history.saveAssistant(normChatId, response, "WHATSAPP");
            } catch (histErr) {
                console.error("Errore salvataggio risposta in history:", histErr.message);
            }

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
