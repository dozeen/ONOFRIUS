/**
 * FactExtractor.js - Motore di estrazione entità e categorizzazione cognizione
 */

const { ENTITY_TYPES, FACT_CATEGORIES } = require("./FactTypes");
const OwnerProfile = require("../../identity/OwnerProfile");

function getKnownPersonNames() {
    const names = new Set(["Owner", "Admin"]);
    const owner = OwnerProfile.get();
    if (owner.name) names.add(owner.name);
    if (Array.isArray(owner.aliases)) owner.aliases.forEach(a => names.add(a));
    if (Array.isArray(owner.familyMembers)) {
        owner.familyMembers.forEach(m => {
            if (m.name) names.add(m.name);
            if (Array.isArray(m.aliases)) m.aliases.forEach(a => names.add(a));
        });
    }
    if (Array.isArray(owner.trustedContacts)) {
        owner.trustedContacts.forEach(c => {
            if (typeof c === 'string') names.add(c);
            else if (c.name) names.add(c.name);
        });
    }
    return Array.from(names).filter(n => n && n.length > 1);
}

class FactExtractor {
    static INPUT = ["text", "meta"];
    static OUTPUT = ["facts", "thoughts", "agenda", "preferences", "entities"];

    constructor(logger = console) {
        this.logger = logger;
    }

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

        if (lower.startsWith("ricordami ") || lower.startsWith("intenzione:") || lower.startsWith("pensiero:") || lower.startsWith("vorrei ") || lower.startsWith("voglio ")) {
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

        // 1. Orari
        const timeRegex = /\b([0-2]?[0-9]:[0-5][0-9]|alle\s+[0-2]?[0-9]|ore\s+[0-2]?[0-9])\b/gi;
        let match;
        while ((match = timeRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.TIME,
                value: match[0],
                index: match.index
            });
        }

        // 2. Persone (Dinamiche da configurazione Owner)
        const personNames = getKnownPersonNames();
        if (personNames.length > 0) {
            const escapedNames = personNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            const personRegex = new RegExp(`\\b(${escapedNames})\\b`, 'gi');
            while ((match = personRegex.exec(text)) !== null) {
                entities.push({
                    type: ENTITY_TYPES.PERSON,
                    value: match[0],
                    index: match.index
                });
            }
        }

        // 3. Date
        const dateRegex = /\b([0-3]?[0-9]\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+\d{4})?|giovedì|giovedi|domattina|domani)\b/gi;
        while ((match = dateRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.DATE,
                value: match[0],
                index: match.index
            });
        }

        // 4. Luoghi
        const locationRegex = /\ba\s+([A-Z][a-zàèéìòù]+)\b/g;
        while ((match = locationRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.LOCATION,
                value: match[0],
                index: match.index
            });
        }

        // 5. Importi
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
