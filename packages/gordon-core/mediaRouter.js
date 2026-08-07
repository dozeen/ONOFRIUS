const whisper = require("./whisper");

async function buildContext(msg, crypto) {
    const chatId = msg.from;

    const isVoice = msg.type === "ptt" || msg.type === "audio";

    const context = {
        id: crypto.randomUUID(),
        chatId,
        sender: chatId,
        timestamp: Date.now(),
        role: "user",
        source: "WhatsApp",
        text: (msg.body || "").trim(),
        contact: {
            id: chatId
        },
        media: {
            hasMedia: msg.hasMedia || false,
            type: msg.type,
            isVoice,
            isImage: msg.type === "image",
            isVideo: msg.type === "video",
            isDocument: msg.type === "document",
            isSticker: msg.type === "sticker"
        },
        metadata: {
            messageId: msg.id._serialized
        }
    };

    console.log("🎤 [MediaRouter] Tipo media:", msg.type, "| isVoice:", isVoice);

    if (context.media.isVoice) {
        context.text = await whisper.transcribe(msg);
    }

    return context;
}

module.exports = {
    buildContext
};
