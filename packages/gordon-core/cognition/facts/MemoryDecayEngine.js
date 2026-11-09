/**
 * MemoryDecayEngine.js - Gestore del Decadimento Temporale dei Fatti (Memory Decay)
 * Riduce progressivamente la confidence degli eventi effimeri col passare del tempo.
 */

class MemoryDecayEngine {
    constructor(opts = {}) {
        this.defaultDecayLambda = opts.decayLambda || 0.35;
        this.archiveThreshold = opts.archiveThreshold || 0.15;
    }

    /**
     * Applica il decadimento temporale ad un singolo fatto
     */
    applyDecayToFact(fact, nowTimestamp = Date.now()) {
        if (!fact) return fact;

        if (fact.immutable === true || fact.isPermanent === true) {
            fact.effectiveConfidence = fact.confidence || 1.0;
            fact.archived = false;
            return fact;
        }

        const lastSeen = fact.lastObservedTimestamp ? new Date(fact.lastObservedTimestamp).getTime() : (fact.timestamp ? new Date(fact.timestamp).getTime() : nowTimestamp);
        const elapsedDays = Math.max(0, (nowTimestamp - lastSeen) / (1000 * 60 * 60 * 24));

        const baseConfidence = fact.confidence || 0.70;
        const effectiveConfidence = Number((baseConfidence * Math.exp(-this.defaultDecayLambda * elapsedDays)).toFixed(2));

        fact.effectiveConfidence = effectiveConfidence;
        fact.elapsedDays = Number(elapsedDays.toFixed(1));

        if (effectiveConfidence < this.archiveThreshold) {
            fact.archived = true;
        } else {
            fact.archived = false;
        }

        if (effectiveConfidence >= 0.85) {
            fact.epistemicState = "CERTAINTY";
        } else if (effectiveConfidence >= 0.45) {
            fact.epistemicState = "BELIEF";
        } else {
            fact.epistemicState = "RUMOR";
        }

        return fact;
    }

    /**
     * Processa un array di fatti applicando il decadimento e filtrando i fatti archiviati
     */
    processFacts(facts = [], includeArchived = false) {
        if (!facts || !Array.isArray(facts)) return [];

        const now = Date.now();
        const processed = facts.map(f => this.applyDecayToFact({ ...f }, now));

        if (includeArchived) {
            return processed;
        }

        return processed.filter(f => !f.archived);
    }
}

module.exports = MemoryDecayEngine;
