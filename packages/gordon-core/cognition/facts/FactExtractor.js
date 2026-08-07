/**
 * FactExtractor.js - Motore di estrazione entità e categorizzazione cognizione
 */

const { ENTITY_TYPES, FACT_CATEGORIES } = require("./FactTypes");

class FactExtractor {
    static INPUT = ["text", "meta"];
    static OUTPUT = ["facts", "thoughts", "agenda", "preferences", "entities"];

    constructor(logger = console) {
        this.logger = logger;
    }

    /**
     * Estrae entità e fatto/intenzione dal testo
     * @param {string} text - Testo in ingresso
     * @param {Object} [meta={}] - Metadati contesto
     * @returns {Object} Cognition Payload { facts, thoughts, agenda, preferences, entities }
     */
    extract(text, meta = {}) {
        if (!text || typeof text !== "string") {
            return { facts: [], thoughts: [], agenda: [], preferences: [], entities: [] };
        }

        const entities = this._extractEntities(text);
        const category = this._categorizeText(text);

        const payload = {
            facts: [],
            thoughts: [],
            agenda: [],
            preferences: [],
            entities: entities
        };

        const cleanedText = text.trim();

        if (category === FACT_CATEGORIES.INTENTION || category === FACT_CATEGORIES.REMINDER) {
            payload.thoughts.push({
                type: "intention",
                content: cleanedText,
                entities: entities,
                created_at: meta.timestamp || Date.now()
            });
        } else if (category === FACT_CATEGORIES.PREFERENCE) {
            payload.preferences.push({
                type: "preference",
                content: cleanedText,
                created_at: meta.timestamp || Date.now()
            });
        } else if (category === FACT_CATEGORIES.FUTURE_EVENT) {
            payload.agenda.push({
                type: "agenda_event",
                content: cleanedText,
                entities: entities,
                created_at: meta.timestamp || Date.now()
            });
        } else {
            payload.facts.push({
                statement: cleanedText,
                entities: entities,
                extracted_at: new Date().toISOString()
            });
        }

        return payload;
    }

    _categorizeText(text) {
        const trimmed = text.trim();
        const lower = trimmed.toLowerCase();

        // Estrai intenzioni solo se c'è un comando esplicito di intenzione all'inizio o "ricordami"
        if (lower.startsWith("ricordami ") || lower.startsWith("intenzione:") || lower.startsWith("pensiero:") || lower.startsWith("vorrei ") || lower.startsWith("voglio ")) {
            // Evita di catturare domande o casual chat come intenzioni (es. "voglio cominciare?", "voglio sapere")
            if (!trimmed.includes("?") && !lower.includes("voglio sapere") && !lower.includes("voglio che")) {
                return FACT_CATEGORIES.INTENTION;
            }
        }

        if (lower.startsWith("preferisco ") || lower.startsWith("preferenza:") || lower.startsWith("non sopporto ")) {
            return FACT_CATEGORIES.PREFERENCE;
        }

        if (lower.startsWith("domattina ") || lower.startsWith("agenda:") || lower.includes("il compleanno di")) {
            return FACT_CATEGORIES.FUTURE_EVENT;
        }

        return FACT_CATEGORIES.FACT;
    }

    _extractEntities(text) {
        const entities = [];

        // 1. Orari (es. 22:30, 18:00, alle 20)
        const timeRegex = /\b([0-2]?[0-9]:[0-5][0-9]|alle\s+[0-2]?[0-9]|ore\s+[0-2]?[0-9])\b/gi;
        let match;
        while ((match = timeRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.TIME,
                value: match[0],
                index: match.index
            });
        }

        // 2. Persone (es. Alice, Bob, Charlie)
        const personRegex = /\b(Alice|Bob|Charlie|David|Eva|Frank|Grace)\b/gi;
        while ((match = personRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.PERSON,
                value: match[0],
                index: match.index
            });
        }

        // 3. Date (es. 07 Maggio 1970, 29 luglio, giovedì, domattina)
        const dateRegex = /\b([0-3]?[0-9]\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+\d{4})?|giovedì|giovedi|domattina|domani)\b/gi;
        while ((match = dateRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.DATE,
                value: match[0],
                index: match.index
            });
        }

        // 4. Luoghi (es. a Roma, a Milano, a Napoli)
        const locationRegex = /\ba\s+(Roma|Milano|Napoli|Bari|Torino|Bologna|Firenze)\b/gi;
        while ((match = locationRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.LOCATION,
                value: match[0],
                index: match.index
            });
        }

        // 5. Importi (es. €300, 300 euro, 500 euro)
        const amountRegex = /(?:€\s*\d+|\d+\s*euro)/gi;
        while ((match = amountRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.AMOUNT,
                value: match[0],
                index: match.index
            });
        }

        return entities;
    }
}

module.exports = FactExtractor;
