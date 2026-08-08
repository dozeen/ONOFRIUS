/**
 * logger.js - Logger Cognitivo con Anonimizzazione e Sanitizzazione dei Log (LogSanitizer)
 */

class LogSanitizer {
    static sanitize(text) {
        if (!text || typeof text !== "string") return text;

        // Maschera i numeri di telefono (es. 393471234567 -> 393***4567)
        let clean = text.replace(/\b(\d{3})\d{4,7}(\d{3,4})\b/g, '$1***$2');

        return clean;
    }
}

function formatMsg(msg) {
    if (typeof msg === "object") {
        try {
            return LogSanitizer.sanitize(JSON.stringify(msg));
        } catch (e) {
            return String(msg);
        }
    }
    return LogSanitizer.sanitize(String(msg));
}

module.exports = {
    info: (tag, msg) => console.log(`[${new Date().toISOString()}] INFO  [${tag}] ${formatMsg(msg)}`),
    debug: (tag, msg) => console.log(`[${new Date().toISOString()}] DEBUG [${tag}] ${formatMsg(msg)}`),
    warn: (tag, msg) => console.warn(`[${new Date().toISOString()}] WARN  [${tag}] ${formatMsg(msg)}`),
    error: (tag, msg) => console.error(`[${new Date().toISOString()}] ERROR [${tag}] ${formatMsg(msg)}`),
    time: (label) => console.time(label),
    timeEnd: (label, tag = "Timer") => console.timeEnd(label)
};
