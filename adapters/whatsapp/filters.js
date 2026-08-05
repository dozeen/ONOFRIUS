const config = require("../../config/config");

/*
 * Tipi di messaggio che Gordon è autorizzato a processare.
 * Tutto il resto viene ignorato.
 */
const ALLOWED_TYPES = new Set([
    "chat",
    "image",
    "video",
    "audio",
    "ptt",
    "document"
]);

function shouldIgnore(msg) {
    if (!msg) return true;
    if (!msg.from) return true;

    // Filtra qualsiasi notifica o aggiornamento di Stato WhatsApp / Broadcast / Newsletter
    const fromStr = String(msg.from || "").toLowerCase();
    const toStr = String(msg.to || "").toLowerCase();
    const remoteStr = String(msg.id?.remote || "").toLowerCase();

    if (fromStr.includes("broadcast") || toStr.includes("broadcast") || remoteStr.includes("broadcast")) {
        return true;
    }

    if (fromStr.includes("newsletter") || toStr.includes("newsletter") || remoteStr.includes("newsletter")) {
        return true;
    }

    /*
     * Accettiamo solo i tipi di messaggio conosciuti.
     * Tutti i messaggi di sistema vengono ignorati.
     */
    if (!ALLOWED_TYPES.has(msg.type)) {
        return true;
    }

    /*
     * Evita messaggi testuali vuoti.
     */
    if (msg.type === "chat" && !msg.body?.trim()) {
        return true;
    }

    return false;
}

module.exports = {
    shouldIgnore
};
