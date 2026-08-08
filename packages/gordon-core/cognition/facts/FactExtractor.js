/**
 * FactExtractor.js - Motore dinamico di estrazione entità, relazioni e fatti cognitivi
 */

const { ENTITY_TYPES, FACT_CATEGORIES } = require("./FactTypes");

class FactExtractor {
    static INPUT = ["text", "meta"];
    static OUTPUT = ["facts", "thoughts", "agenda", "preferences", "entities", "relationships"];

    constructor(logger = console) {
        this.logger = logger;
    }

    extract(text, meta = {}) {
        if (!text || typeof text !== "string") {
            return { facts: [], thoughts: [], agenda: [], preferences: [], entities: [], relationships: [] };
        }

        const entities = this._extractEntities(text);
        const relationships = this._extractRelationships(text);
        const category = this._categorizeText(text);

        const payload = {
            facts: [],
            thoughts: [],
            agenda: [],
            preferences: [],
            entities: entities,
            relationships: relationships
        };

        const cleanedText = text.trim();

        // 1. Intenzione di comunicazione / Outreach ("comunicare a X che...", "dici a X che...")
        const outreachMatch = cleanedText.match(/\b(comunicare|dire|avvisare|scrivere)\s+a\s+([A-Za-z]+)\s+che\s+(.+)/i);
        if (outreachMatch) {
            payload.thoughts.push({
                type: "outreach_intention",
                target: outreachMatch[2],
                content: outreachMatch[3],
                created_at: meta.timestamp || Date.now()
            });
        }

        // 2. Regole e valori per familiari ("X mia figlia non fuma...")
        if (relationships.length > 0) {
            for (const rel of relationships) {
                payload.facts.push({
                    type: "relationship_fact",
                    person: rel.person,
                    relation: rel.relation,
                    details: cleanedText,
                    extracted_at: new Date().toISOString()
                });
            }
        }

        if (category === FACT_CATEGORIES.INTENTION || category === FACT_CATEGORIES.REMINDER) {
            payload.thoughts.push({
                type: "intention",
                content: cleanedText,
                entities: entities,
                created_at: meta.timestamp || Date.now()
            });
        } else if (category === FACT_CATEGORIES.PREFERENCE || cleanedText.includes("non fuma") || cleanedText.includes("non beve")) {
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

        if (lower.startsWith("ricordami ") || lower.startsWith("intenzione:") || lower.includes("comunicare a") || lower.startsWith("vorrei ") || lower.startsWith("voglio ")) {
            if (!trimmed.includes("?") && !lower.includes("voglio sapere")) {
                return FACT_CATEGORIES.INTENTION;
            }
        }

        if (lower.startsWith("preferisco ") || lower.startsWith("preferenza:") || lower.includes("non fuma") || lower.includes("non beve")) {
            return FACT_CATEGORIES.PREFERENCE;
        }

        if (lower.startsWith("domattina ") || lower.startsWith("agenda:") || lower.includes("il compleanno di")) {
            return FACT_CATEGORIES.FUTURE_EVENT;
        }

        return FACT_CATEGORIES.FACT;
    }

    _extractRelationships(text) {
        const rels = [];
        // Match: "Roberta ( mia figlia )", "Mario ( mio fratello )", "Silvana ( mia moglie )"
        const relRegex = /\b([A-Z][a-z]+)\s*\(\s*mi[ao]\s+(figlia|figlio|moglie|marito|fratello|sorella|madre|padre)\s*\)/gi;
        let match;
        while ((match = relRegex.exec(text)) !== null) {
            rels.push({
                person: match[1],
                relation: match[2].toLowerCase()
            });
        }
        return rels;
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

        // 2. Persone (Qualsiasi nome proprio maiuscolo o Nomi noti)
        const personRegex = /\b([A-Z][a-z]+)\b/g;
        const ignoreWords = new Set(["Sei", "Gordon", "Scrivi", "Onofrio", "WhatsApp", "Utente", "Direttiva", "Suprema", "Oggi", "Domani", "Ok", "Roberta", "Minervino"]);
        while ((match = personRegex.exec(text)) !== null) {
            if (!ignoreWords.has(match[1]) && match[1].length > 2) {
                entities.push({
                    type: ENTITY_TYPES.PERSON,
                    value: match[1],
                    index: match.index
                });
            }
        }

        // 3. Luoghi dinamici (es. a Minervino, a Bari, a Roma, a Torre Giulia)
        const locationRegex = /\ba\s+([A-Z][a-z]+)\b/gi;
        while ((match = locationRegex.exec(text)) !== null) {
            entities.push({
                type: ENTITY_TYPES.LOCATION,
                value: match[1],
                index: match.index
            });
        }

        return entities;
    }
}

module.exports = FactExtractor;
