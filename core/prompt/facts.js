/**
 * facts.js - Formattatore della sezione FACTS per Prompt Builder 2.1
 * Include il FamilyPrivacyManager per proteggere le informazioni riservate e familiari.
 */

const { ENTITY_TYPES } = require("../cognition/facts/FactTypes");
const FamilyPrivacyManager = require("../privacy/FamilyPrivacyManager");

module.exports = function buildFactsPrompt(context) {
    if (!context) return "";

    const factsPayload = context.facts;
    if (!factsPayload) return "";

    let entities = (factsPayload && factsPayload.entities) || [];
    let statements = (factsPayload && factsPayload.facts) || [];

    // Privacy Filter tramite FamilyPrivacyManager basato sul destinatario della chat
    const recipientName = (context.contactName || context.senderName || context.chat?.name || "");

    statements = FamilyPrivacyManager.filterAllowed(statements, recipientName);

    if (entities.length === 0 && statements.length === 0) return "";

    const people = entities.filter(e => e.type === ENTITY_TYPES.PERSON).map(e => e.value);
    const times = entities.filter(e => e.type === ENTITY_TYPES.TIME).map(e => e.value);
    const dates = entities.filter(e => e.type === ENTITY_TYPES.DATE).map(e => e.value);
    const places = entities.filter(e => e.type === ENTITY_TYPES.LOCATION).map(e => e.value);
    const amounts = entities.filter(e => e.type === ENTITY_TYPES.AMOUNT).map(e => e.value);

    let output = "==================\nFACTS\n==================\n";

    if (people.length > 0) output += `• PERSON: ${[...new Set(people)].join(", ")}\n`;
    if (times.length > 0) output += `• TIME: ${[...new Set(times)].join(", ")}\n`;
    if (dates.length > 0) output += `• DATE: ${[...new Set(dates)].join(", ")}\n`;
    if (places.length > 0) output += `• PLACE: ${[...new Set(places)].join(", ")}\n`;
    if (amounts.length > 0) output += `• AMOUNT: ${[...new Set(amounts)].join(", ")}\n`;

    if (statements.length > 0) {
        output += "• STATEMENTS:\n";
        for (const st of statements) {
            output += `  - "${st.statement || st}"\n`;
        }
    }

    return output.trim();
};
