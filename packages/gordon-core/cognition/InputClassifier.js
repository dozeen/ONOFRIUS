/**
 * InputClassifier.js - Classificatore di Input Cognitivo per Gordon 3
 */

const { FACT_CATEGORIES } = require("./facts/FactTypes");

const INPUT_CATEGORIES = {
    CONVERSATION: "CONVERSATION",
    THOUGHT: "THOUGHT",
    AGENDA: "AGENDA",
    PREFERENCE: "PREFERENCE",
    FACT_KNOWLEDGE: "FACT_KNOWLEDGE",
    COMMAND: "COMMAND"
};

class InputClassifier {
    static INPUT = ["text", "factsPayload"];
    static OUTPUT = ["inputClassification"];

    /**
     * Classifica il testo in ingresso
     * @param {string} text
     * @param {Object} [factsPayload={}]
     * @returns {Object} { category, isCognitiveNote, isConversation }
     */
    classify(text, factsPayload = {}) {
        if (!text || typeof text !== "string") {
            return {
                category: INPUT_CATEGORIES.CONVERSATION,
                isCognitiveNote: false,
                isConversation: true
            };
        }

        const trimmed = text.trim();
        const lower = trimmed.toLowerCase();

        // 0. REQUISITO SUPREMO: Qualsiasi messaggio che contiene un punto interrogativo '?'
        // o è espresso come domanda/interrogativo è SEMPRE una Conversazione e richiede l'LLM!
        if (trimmed.includes("?") || lower.endsWith("?") || lower.startsWith("chi ") || lower.startsWith("cosa ") || lower.startsWith("come ") || lower.startsWith("dove ") || lower.startsWith("quando ") || lower.startsWith("perché ") || lower.startsWith("perche ")) {
            return {
                category: INPUT_CATEGORIES.CONVERSATION,
                isCognitiveNote: false,
                isConversation: true
            };
        }

        // 1. Comandi espliciti (es. /status, !help)
        if (trimmed.startsWith("/") || trimmed.startsWith("!")) {
            return {
                category: INPUT_CATEGORIES.COMMAND,
                isCognitiveNote: false,
                isConversation: true
            };
        }

        // 2. Intenzioni / Pensieri (es. "Vorrei imparare l'inglese", "Pensiero: ...")
        if (lower.startsWith("pensiero:") || lower.startsWith("intenzione:") || lower.startsWith("vorrei ") || lower.startsWith("voglio ")) {
            return {
                category: INPUT_CATEGORIES.THOUGHT,
                isCognitiveNote: true,
                isConversation: false
            };
        }

        // 3. Fatti / Conoscenza pura (es. "il mio compleanno e' il 07 Maggio 1970", "Fatto: ...")
        if (lower.startsWith("fatto:") || lower.includes("e' il mio compleanno") || lower.includes("sono nato il")) {
            return {
                category: INPUT_CATEGORIES.FACT_KNOWLEDGE,
                isCognitiveNote: true,
                isConversation: false
            };
        }

        // 4. Preferenze e valutazioni di carattere (es. "Preferisco comunicare via email", "Fabio è molto preciso")
        if (lower.startsWith("preferenza:") || lower.startsWith("preferisco ") || (factsPayload.preferences && factsPayload.preferences.length > 0) || (factsPayload.facts && factsPayload.facts.length > 0 && (lower.includes(" è ") || lower.includes(" e' ")))) {
            return {
                category: INPUT_CATEGORIES.PREFERENCE,
                isCognitiveNote: true,
                isConversation: false
            };
        }

        // 5. Promemoria / Agenda (es. "Domattina quando Dolly dà il buongiorno tu ricordagli...")
        if (lower.startsWith("ricordami ") || lower.startsWith("domattina ") || lower.startsWith("agenda:") || lower.startsWith("domani ") || lower.includes("domani alle ")) {
            return {
                category: INPUT_CATEGORIES.AGENDA,
                isCognitiveNote: true,
                isConversation: false
            };
        }

        // 6. Conversazione normale
        return {
            category: INPUT_CATEGORIES.CONVERSATION,
            isCognitiveNote: false,
            isConversation: true
        };
    }
}

module.exports = {
    InputClassifier,
    INPUT_CATEGORIES
};
