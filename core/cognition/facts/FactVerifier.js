/**
 * FactVerifier.js - Gatekeeper di Verità Zero-Trust per risposte LLM
 */

const OwnerProfile = require("../../identity/OwnerProfile");

function getSystemPeople() {
    const people = ["owner", "system", "gordon", "onofrius", "me"];
    const owner = OwnerProfile.get();
    if (owner.name) people.push(owner.name.toLowerCase());
    if (Array.isArray(owner.aliases)) owner.aliases.forEach(a => people.push(a.toLowerCase()));
    if (Array.isArray(owner.familyMembers)) {
        owner.familyMembers.forEach(m => {
            if (m.name) people.push(m.name.toLowerCase());
            if (Array.isArray(m.aliases)) m.aliases.forEach(a => people.push(a.toLowerCase()));
        });
    }
    return people;
}

class FactVerifier {
    constructor() {
        this.extractor = new FactExtractor();
    }

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

    verify(llmOutput, contextEntities = [], meta = {}) {
        if (!llmOutput || typeof llmOutput !== "string") {
            return { valid: true, violations: [] };
        }

        const violations = [];

        const privacyCheck = FamilyPrivacyManager.checkPrivacy(llmOutput, meta);
        if (!privacyCheck.allowed) {
            violations.push({
                type: "PRIVACY_VIOLATION",
                found: privacyCheck.violation.subject,
                message: privacyCheck.violation.message
            });
        }

        if (contextEntities && contextEntities.length > 0) {
            const outputEntities = this.extractor._extractEntities(llmOutput);

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

            const contextPeople = contextEntities.filter(e => e.type === ENTITY_TYPES.PERSON).map(e => e.value.toLowerCase().trim());
            
            if (meta.contactName) contextPeople.push(meta.contactName.toLowerCase().trim());
            if (meta.senderName) contextPeople.push(meta.senderName.toLowerCase().trim());
            if (meta.identity?.contact?.name) contextPeople.push(meta.identity.contact.name.toLowerCase().trim());
            contextPeople.push(...getSystemPeople());

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
