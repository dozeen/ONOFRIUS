/**
 * FactVerifier.js - Guardiano di Veridicità e Controllo Allucinazioni Operative
 */

const AgendaCapability = require("../../capability/AgendaCapability");

class FactVerifier {
    verify(candidateResponse, context = {}) {
        return FactVerifier.verify(candidateResponse, context);
    }

    static verify(candidateResponse, context = {}) {
        if (!candidateResponse || typeof candidateResponse !== "string") {
            return { valid: true, response: candidateResponse };
        }

        const userText = (context.text || (context.event && context.event.text) || "").toLowerCase();
        const lowerResp = candidateResponse.toLowerCase();

        // 1. Controllo Allucinazione Operativa sull'Agenda
        const isAgendaAsk = AgendaCapability.isAgendaQuery(userText);
        const hasHallucinatedAction = lowerResp.match(/\b(controlla|apri|guarda|nell'app|sul pc|nel calendario|l'app|l'applicazione)\b/i);

        if (isAgendaAsk && hasHallucinatedAction) {
            console.log("⚠️ [FactVerifier] Rilevata allucinazione operativa sull'agenda! Sostituzione deterministica in corso...");
            const realAgendaReply = AgendaCapability.executeDeterministic(userText);
            return {
                valid: false,
                response: realAgendaReply,
                replaced: true,
                reason: "Hallucinated operational agenda phrase replaced by deterministic AgendaEngine output."
            };
        }

        return {
            valid: true,
            response: candidateResponse
        };
    }
}

module.exports = FactVerifier;
