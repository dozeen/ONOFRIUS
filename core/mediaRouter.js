const whisper = require("./whisper");

async function buildContext(msg, crypto) {
    const chatId = msg.from;
    const isVoice = msg.type === "ptt" || msg.type === "audio";

    const context = {
        // Identità
        id: crypto.randomUUID(),
        // Nuovo modello
        chatId,
        // Compatibilità con il vecchio codice
        sender: chatId,
        timestamp: Date.now(),
        role: "user",
        // Provenienza
        source: "WhatsApp",
        // Testo
        text: (msg.body || "").trim(),
        // Contatto
        contact: {
            id: chatId
        },
        // Media
        media: {
            hasMedia: msg.hasMedia || false,
            type: msg.type,
            isVoice: isVoice,
            isImage: msg.type === "image",
            isVideo: msg.type === "video",
            isDocument: msg.type === "document",
            isSticker: msg.type === "sticker"
        },
        // Extra
        metadata: {
            messageId: msg.id ? (msg.id._serialized || msg.id.id) : "N/D"
        }
    };

    // ------------------------------------------
    // Vocali & Audio
    // ------------------------------------------
    console.log("🎤 [MediaRouter] Tipo media:", msg.type, "| isVoice:", isVoice, "| hasMedia:", msg.hasMedia);

    if (context.media.isVoice) {
        const whisperRes = await whisper.transcribe(msg);
        if (whisperRes && typeof whisperRes === "object") {
            context.text = whisperRes.transcript || "";
            context.audioMetadata = whisperRes;
            if (whisperRes.status === "error") {
                console.warn(`⚠️ [MediaRouter] Trascrizione vocale non riuscita: ${whisperRes.reason || "Errore sconosciuto"}`);
            }
        } else if (typeof whisperRes === "string") {
            context.text = whisperRes;
        }
    }

    return context;
}

module.exports = {
    buildContext
};
