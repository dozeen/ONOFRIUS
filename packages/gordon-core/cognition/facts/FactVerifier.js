/**
 * FactVerifier.js - Guardiano Cognitivo Anti-Allucinazioni
 * Intercetta frasi operative allucinate sull'agenda (es. "controlla l'app dei meeting", "nessun appuntamento fisso oggi", "vai dove vuoi")
 * e le sostituisce con i dati reali ed oggettivi dell'AgendaEngine.
 */

const AgendaEngine = require("../../agenda/AgendaEngine");

class FactVerifier {
    static verify(candidateResponse, context = {}) {
        const text = context.text || (context.event && context.event.text) || "";
        const resp = (candidateResponse || "").toLowerCase();

        // Rilevamento query agenda / impegni
        const isAgendaQuery = text.match(/\b(appuntamento|appuntamenti|agenda|calendario|eventi|impegno|impegni|cosa devo fare|cosa ho da fare)\b/i) !== null;

        if (isAgendaQuery) {
            // Frasi di allucinazione operativa o invenzioni dell'LLM
            const isOperationalHallucination = resp.includes("controlla") ||
                resp.includes("app dei meeting") ||
                resp.includes("apri il calendario") ||
                resp.includes("nessun appuntamento fisso") ||
                resp.includes("fai come preferisci") ||
                resp.includes("vai dove vuoi");

            if (isOperationalHallucination) {
                console.warn("⚠️ [FactVerifier] Rilevata allucinazione operativa sull'agenda! Sostituzione deterministica in corso...");

                const isTomorrow = text.toLowerCase().includes("domani");
                const targetDate = isTomorrow ?
                    new Date(Date.now() + 86400000).toISOString().split("T")[0] :
                    new Date().toISOString().split("T")[0];

                const dateLabel = isTomorrow ? "domani" : "oggi";
                const events = AgendaEngine.getGlobal().filter(e => e.date === targetDate);

                let realReply = "";
                if (events.length === 0) {
                    realReply = `Per ${dateLabel} non hai appuntamenti in agenda.`;
                } else {
                    realReply = `Hai i seguenti appuntamenti per ${dateLabel}:\n\n` +
                        events.map(e => `• ${e.time ? e.time + ' - ' : ''}${e.title}${e.person ? ' (con ' + e.person + ')' : ''}`).join("\n");
                }

                return {
                    valid: false,
                    response: realReply,
                    replaced: true,
                    reason: "Hallucinated operational agenda phrase replaced by deterministic AgendaEngine output."
                };
            }
        }

        return { valid: true, response: candidateResponse };
    }

    verify(candidateResponse, context = {}) {
        return FactVerifier.verify(candidateResponse, context);
    }
}

module.exports = FactVerifier;
