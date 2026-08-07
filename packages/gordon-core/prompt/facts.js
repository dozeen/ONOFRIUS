/**
 * facts.js - Formattatore della sezione FACTS per Prompt Builder 2.1
 * Inserisce le informazioni con notazione della sfumatura epistemica (Certezza vs Credenza vs Rumor).
 */

const { ENTITY_TYPES } = require("../cognition/facts/FactTypes");
const FamilyPrivacyManager = require("../privacy/FamilyPrivacyManager");

module.exports = function buildFactsPrompt(context) {
    if (!context) return "";

    const factsPayload = context.facts;
    let statements = (factsPayload && factsPayload.facts) || [];

    if (context.factRegistry && typeof context.factRegistry.getRecent === "function") {
        const recentRegistered = context.factRegistry.getRecent(10);
        if (recentRegistered && recentRegistered.length > 0) {
            statements = [...statements, ...recentRegistered];
        }
    }

    const recipientName = (context.contactName || context.senderName || context.chat?.name || "");

    statements = FamilyPrivacyManager.filterAllowed(statements, recipientName);

    if (!statements || statements.length === 0) return "";

    const certainties = statements.filter(s => (s.epistemicState === "CERTAINTY" || (s.confidence >= 0.85)));
    const beliefs = statements.filter(s => (s.epistemicState === "BELIEF" || (s.confidence >= 0.45 && s.confidence < 0.85)));
    const rumors = statements.filter(s => (s.epistemicState === "RUMOR" || (s.confidence < 0.45 && s.confidence > 0)));

    let output = "==================\nCONOSCENZA DEL MONDO & FATTI (Epistemic Matrix)\n==================\n";

    if (certainties.length > 0) {
        output += "• CERTEZZE / FATTI CONFERMATI (Puoi confermare direttamente):\n";
        for (const st of certainties) {
            const stmtText = st.statement || st;
            output += `  - "${stmtText}" (Confidence: ${(st.confidence || 0.95).toFixed(2)})\n`;
        }
    }

    if (beliefs.length > 0) {
        output += "• CREDENZE / FATTI PROBABILI (Usa formule di cautela: 'Mi pare di aver sentito che...', 'Se non ricordo male...'):\n";
        for (const st of beliefs) {
            const stmtText = st.statement || st;
            output += `  - "${stmtText}" (Confidence: ${(st.confidence || 0.70).toFixed(2)})\n`;
        }
    }

    if (rumors.length > 0) {
        output += "• VOCI NON CONFERMATE (Esprimi incertezza: 'Girava voce che...'):\n";
        for (const st of rumors) {
            const stmtText = st.statement || st;
            output += `  - "${stmtText}" (Confidence: ${(st.confidence || 0.30).toFixed(2)})\n`;
        }
    }

    return output.trim();
};
