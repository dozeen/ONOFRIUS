/**
 * LanguageEngine.js - Trasforma la decisione ed il tono in linguaggio naturale (Strato Language)
 */

class LanguageEngine {
    buildText(decision, context = {}) {
        if (!decision) return "";

        if (typeof decision === "string") return decision.trim();

        if (decision.reply) return decision.reply.trim();

        return "";
    }
}

module.exports = new LanguageEngine();
