const whisper = require("./whisper");

async function buildContext(msg, crypto) {

    const chatId = msg.from;

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

            isVoice: msg.type === "ptt",

            isImage: msg.type === "image",

            isVideo: msg.type === "video",

            isDocument: msg.type === "document",

            isSticker: msg.type === "sticker"

        },

        // Extra
        metadata: {

            messageId: msg.id._serialized

        }

    };

// ------------------------------------------
// Vocali
// ------------------------------------------

console.log("🎤 MediaRouter");
console.log("Tipo media:", msg.type);

if (context.media.isVoice) {
    context.text = await whisper.transcribe(msg);
}

return context;

}

module.exports = {

    buildContext

};
