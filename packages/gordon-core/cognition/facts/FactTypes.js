/**
 * FactTypes.js - Formati ed enums per il Fact Engine di Gordon 3
 */

const ENTITY_TYPES = Object.freeze({
    PERSON: "PERSON",
    LOCATION: "LOCATION",
    DATE: "DATE",
    TIME: "TIME",
    AMOUNT: "AMOUNT",
    PHONE: "PHONE",
    EMAIL: "EMAIL"
});

const FACT_CATEGORIES = Object.freeze({
    INTENTION: "INTENTION",      // "Vorrei..."
    FUTURE_EVENT: "FUTURE_EVENT",// "Domani..."
    REMINDER: "REMINDER",        // "Ricordami..."
    FACT: "FACT",                // "Fabio mi ha chiamato"
    PREFERENCE: "PREFERENCE"     // "Mi piace..."
});

module.exports = {
    ENTITY_TYPES,
    FACT_CATEGORIES
};
