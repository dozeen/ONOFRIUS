/**
 * InferredContext.js - Ipotesi, Correlazioni ed Inferenze (Tier 2: Inferred Context)
 */

class InferredContext {
    constructor() {
        this.hypotheses = [];
    }

    addHypothesis(hypothesis) {
        if (!hypothesis || !hypothesis.title) return;
        this.hypotheses.unshift({
            type: "emergent_hypothesis",
            title: hypothesis.title,
            confidence: hypothesis.confidence || 0.80,
            evidence: hypothesis.evidence || [],
            timestamp: Date.now()
        });
        if (this.hypotheses.length > 50) this.hypotheses.pop();
    }

    getHypotheses() {
        return this.hypotheses;
    }
}

module.exports = new InferredContext();
