/**
 * Gordon3
 * Event Types
 *
 * Tipi principali di Event.
 * La semantica specifica viene descritta
 * nel payload (subtype, state, ecc.).
 */

module.exports = Object.freeze({

    MESSAGE: "message",

    STATUS: "status",

    COMMAND: "command",

    NOTIFICATION: "notification",

    MEMORY: "memory",

    KNOWLEDGE: "knowledge",

    TASK: "task",

    IMAGE: "image",

    VIDEO: "video",

    AUDIO: "audio",

    DOCUMENT: "document"

});
