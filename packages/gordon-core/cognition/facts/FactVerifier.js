/**
 * FactVerifier.js - Gatekeeper di Verità Zero-Trust per risposte LLM
 */

const { ENTITY_TYPES } = require("./FactTypes");
const FactExtractor = require("./FactExtractor");
const FamilyPrivacyManager = require("../../privacy/FamilyPrivacyManager");

const ResponseSanitizer = require("./ResponseSanitizer");

class FactVerifier {
    constructor() {
        this.sanitizer = new ResponseSanitizer();
        this.extractor = new FactExtractor();
    }

    /**
     * Normalizza la rappresentazione di un orario per confronto flessibile (es. "alle 18", "18:00:00" -> "18:00")
     */
    _normalizeTime(timeStr) {
        if (!timeStr) return "";
        const digits = timeStr.match(/\b([0-2]?[0-9])(?::([0-5][0-9]))?\b/);
        if (digits) {
            const hh = digits[1].padStart(2, "0");
            const mm = digits[2] || "00";
            return `${hh}:${mm}`;
        }
        return timeStr.toLowerCase().trim();
    }

    /**
     * Verifica la risposta generata rispetto ai fatti/entità di contesto e alle regole di riservatezza
     * @param {string} llmOutput - Testo prodotto dall'LLM
     * @param {Array} contextEntities - Entità accertate presenti nello stimolo o nel contesto
     * @param {Object} [meta={}] - Metadati di contesto (recipient, isOwner, etc.)
     * @returns {Object} { valid: boolean, violations: Array, reason?: string }
     */
    verify(llmOutput, contextEntities = [], meta = {}) {
        if (!llmOutput || typeof llmOutput !== "string") {
            return { valid: true, violations: [] };
        }

        const leakCheck = this.sanitizer.detectLeak(llmOutput);
        if (leakCheck.leaked) {
            return {
                valid: false,
                violations: [{ type: "PROMPT_LEAK", found: leakCheck.pattern }],
                reason: `Violazione Anti-Prompt-Leak: Trovata istruzione di sistema o meta-commento (${leakCheck.pattern})`
            };
        }

        const violations = [];

        // 0. Privacy Guard: Riservatezza Familiare tramite FamilyPrivacyManager (passando l'intero oggetto meta)
        const privacyCheck = FamilyPrivacyManager.checkPrivacy(llmOutput, meta);
        if (!privacyCheck.allowed) {
            violations.push({
                type: "PRIVACY_VIOLATION",
                found: privacyCheck.violation.subject,
                message: privacyCheck.violation.message
            });
        }

        // Se ci sono entità di contesto note
        if (contextEntities && contextEntities.length > 0) {
            const outputEntities = this.extractor._extractEntities(llmOutput);

            // 1. Controllo Orari (Time Mismatches)
            const contextTimes = contextEntities.filter(e => e.type === ENTITY_TYPES.TIME).map(e => this._normalizeTime(e.value));
            const outputTimes = outputEntities.filter(e => e.type === ENTITY_TYPES.TIME).map(e => this._normalizeTime(e.value));

            if (contextTimes.length > 0 && outputTimes.length > 0) {
                for (const outTime of outputTimes) {
                    const matches = contextTimes.some(ctxTime => ctxTime === outTime || ctxTime.includes(outTime) || outTime.includes(ctxTime));
                    if (!matches) {
                        violations.push({
                            type: ENTITY_TYPES.TIME,
                            expected: contextTimes,
                            found: outTime,
                            message: `Orario non corrispondente: atteso uno tra [${contextTimes.join(", ")}], trovato '${outTime}'`
                        });
                    }
                }
            }

            // 2. Controllo Persone (Person Name Alteration)
            const contextPeople = contextEntities.filter(e => e.type === ENTITY_TYPES.PERSON).map(e => e.value.toLowerCase().trim());
            
            if (meta.contactName) contextPeople.push(meta.contactName.toLowerCase().trim());
            if (meta.senderName) contextPeople.push(meta.senderName.toLowerCase().trim());
            if (meta.identity?.contact?.name) contextPeople.push(meta.identity.contact.name.toLowerCase().trim());
            contextPeople.push("owner", "gordon", "alice", "bob");

            const outputPeople = outputEntities.filter(e => e.type === ENTITY_TYPES.PERSON).map(e => e.value.toLowerCase().trim());

            if (outputPeople.length > 0) {
                for (const outPerson of outputPeople) {
                    const matches = contextPeople.some(ctxPerson => ctxPerson.includes(outPerson) || outPerson.includes(ctxPerson));
                    if (!matches) {
                        violations.push({
                            type: ENTITY_TYPES.PERSON,
                            expected: contextPeople,
                            found: outPerson,
                            message: `Persona alterata o non riconosciuta: attesa tra [${contextPeople.join(", ")}], trovata '${outPerson}'`
                        });
                    }
                }
            }
        }

        if (violations.length > 0) {
            return {
                valid: false,
                violations: violations,
                reason: `Fact/Privacy Verification Failed: ${violations.map(v => v.message).join(" | ")}`
            };
        }

        return { valid: true, violations: [] };
    }
}

module.exports = FactVerifier;
