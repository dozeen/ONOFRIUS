/**
 * FactVerifier.js - Guardiano Cognitivo Anti-Allucinazioni
 * Intercetta frasi operative allucinate sull'agenda (es. "controlla l'app dei meeting", "nessun appuntamento fisso oggi", "vai dove vuoi", "niente urgenti")
 * e le sostituisce con i dati reali ed oggettivi dell'AgendaEngine.
 */

const AgendaEngine = require("../../agenda/AgendaEngine");
const FamilyPrivacyManager = require("../../privacy/FamilyPrivacyManager");
const ResponseSanitizer = require("./ResponseSanitizer");
const sanitizer = new ResponseSanitizer();

class FactVerifier {
    static verify(candidateResponse, context = {}) {
        // 1. Controllo Prompt Leak ed Istruzioni Interne
        const leakCheck = sanitizer.detectLeak(candidateResponse);
        if (leakCheck.leaked) {
            return {
                valid: false,
                response: null,
                blocked: true,
                reason: `Violazione Anti-Prompt-Leak: ${leakCheck.pattern}`
            };
        }

        // 2. Controllo Privacy Familiare e Riservatezza
        const privacyCheck = FamilyPrivacyManager.checkPrivacy(candidateResponse, context);
        if (!privacyCheck.allowed) {
            return {
                valid: false,
                response: null,
                blocked: true,
                reason: privacyCheck.violation?.message || "Violazione di riservatezza familiare"
            };
        }

        // 3. Controllo Incongruenze Entità (es. Orari allucinati se sono fornite entities)
        const entities = Array.isArray(context) ? context : (context.entities || []);
        if (entities.length > 0) {
            const timeEntities = entities.filter(e => e.type === "TIME" || e.type === "time");
            if (timeEntities.length > 0) {
                const responseTimes = candidateResponse.match(/\b[0-2]?[0-9]:[0-5][0-9]\b/g) || [];
                for (const rt of responseTimes) {
                    const matchesAny = timeEntities.some(te => {
                        const val = String(te.value || '');
                        return val.includes(rt) || rt.startsWith(val.replace(/\D/g, ''));
                    });
                    if (!matchesAny) {
                        return {
                            valid: false,
                            response: null,
                            blocked: true,
                            reason: `Incongruenza temporale: orario '${rt}' non presente nei fatti confermati.`
                        };
                    }
                }
            }
        }

        const text = (context.text || (context.event && context.event.text) || "").toLowerCase();
        const resp = (candidateResponse || "").toLowerCase();

        // Rilevamento query agenda / impegni
        const isAgendaQuery = text.match(/\b(appuntamento|appuntamenti|agenda|calendario|eventi|impegno|impegni|cosa devo fare|cosa ho da fare)\b/i) !== null;

        if (isAgendaQuery) {
            // Frasi di allucinazione operativa o invenzioni dell'LLM
            const isOperationalHallucination = resp.includes("controlla") ||
                resp.includes("app dei meeting") ||
                resp.includes("apri il calendario") ||
                resp.includes("nessun appuntamento") ||
                resp.includes("niente urgenti") ||
                resp.includes("stai tranquillo") ||
                resp.includes("fai come preferisci") ||
                resp.includes("vai dove vuoi") ||
                resp.includes("nessun impegni");

            if (isOperationalHallucination) {
                console.warn("⚠️ [FactVerifier] Rilevata allucinazione operativa sull'agenda! Sostituzione deterministica in corso...");

                const isTomorrow = text.includes("domani");
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
