/**
 * KnowledgeFusionEngine.js - Fusione della Conoscenza e Confidence Dinamica per Gordon 3
 * Unifica osservazioni da più fonti (Status, Messaggi, Notizie) elevando la confidence dei fatti.
 */

class KnowledgeFusionEngine {
    constructor() {
        this.confidenceScale = {
            STATUS: 0.70,
            MESSAGE: 0.80,
            OFFICIAL_NEWS: 0.95,
            ANSA: 0.99
        };
    }

    /**
     * Calcola la somiglianza semantica tra due fatti
     */
    calculateSimilarity(factA, factB) {
        const cleanA = (factA.statement || "").toLowerCase().replace(/[^a-z0-9àèéìòù\s]/gi, "");
        const cleanB = (factB.statement || "").toLowerCase().replace(/[^a-z0-9àèéìòù\s]/gi, "");

        if (cleanA === cleanB) return 1.0;

        const wordsA = cleanA.split(/\s+/).filter(w => w.length > 2);
        const wordsB = cleanB.split(/\s+/).filter(w => w.length > 2);

        if (wordsA.length === 0 || wordsB.length === 0) return 0;

        const matches = wordsA.filter(w => wordsB.includes(w));
        const score = (matches.length * 2) / (wordsA.length + wordsB.length);

        return score;
    }

    /**
     * Calcola la confidence combinata da più fonti
     */
    calculateCombinedConfidence(sources = []) {
        if (!sources || sources.length === 0) return 0.50;

        const hasOfficial = sources.some(s => {
            const srcStr = String(s.source || "").toUpperCase();
            return srcStr.includes("ANSA") || srcStr.includes("TG") || srcStr.includes("NEWS");
        });
        if (hasOfficial) return 0.99;

        let unconfidenceProduct = 1.0;
        for (const src of sources) {
            const conf = src.confidence || 0.70;
            unconfidenceProduct *= (1 - conf);
        }

        let combined = 1 - unconfidenceProduct;
        combined = Math.min(0.99, Math.max(0.70, Number(combined.toFixed(2))));
        return combined;
    }

    /**
     * Determina l'etichetta epistemica ("Sapere" vs "Credere")
     */
    getEpistemicLabel(confidence) {
        if (confidence >= 0.85) return "CERTAINTY"; // Sapere (Fatto Confermato)
        if (confidence >= 0.45) return "BELIEF";    // Credere (Probabile)
        return "RUMOR";                             // Voce / Incertezza
    }

    /**
     * Tenta di fondere un nuovo fatto con quelli esistenti
     */
    fuse(existingFacts = [], newFact) {
        if (!newFact || !newFact.statement) {
            return { merged: false, fact: newFact };
        }

        for (const existing of existingFacts) {
            const similarity = this.calculateSimilarity(existing, newFact);
            if (similarity >= 0.50) {
                if (!existing.sources) {
                    existing.sources = [{
                        source: existing.source || "system",
                        author: existing.author || "unknown",
                        timestamp: existing.timestamp || existing.extracted_at,
                        confidence: existing.confidence || 0.70
                    }];
                }

                const newSourceEntry = {
                    source: newFact.source || "unknown",
                    author: newFact.author || "unknown",
                    timestamp: newFact.timestamp || new Date().toISOString(),
                    confidence: newFact.confidence || 0.70
                };

                const isDuplicateSource = existing.sources.some(s => s.source === newSourceEntry.source && s.author === newSourceEntry.author);
                if (!isDuplicateSource) {
                    existing.sources.push(newSourceEntry);
                }

                existing.lastObservedTimestamp = new Date().toISOString();
                existing.confidence = this.calculateCombinedConfidence(existing.sources);
                existing.epistemicState = this.getEpistemicLabel(existing.confidence);

                console.log(`🧩 KNOWLEDGE FUSED: "${existing.statement}" | Fonti: ${existing.sources.length} | Confidence: ${existing.confidence} [${existing.epistemicState}]`);

                return { merged: true, fact: existing };
            }
        }

        const initialConfidence = newFact.confidence || 0.70;
        newFact.confidence = initialConfidence;
        newFact.epistemicState = this.getEpistemicLabel(initialConfidence);
        newFact.lastObservedTimestamp = newFact.timestamp || new Date().toISOString();
        newFact.sources = [{
            source: newFact.source || "system",
            author: newFact.author || "unknown",
            timestamp: newFact.lastObservedTimestamp,
            confidence: initialConfidence
        }];

        return { merged: false, fact: newFact };
    }
}

module.exports = KnowledgeFusionEngine;
