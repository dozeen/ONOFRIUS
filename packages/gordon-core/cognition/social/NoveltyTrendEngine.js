/**
 * NoveltyTrendEngine.js - Calcola la "Novelty" di un termine (quanto è insolito vs normale)
 */

class NoveltyTrendEngine {
    constructor() {
        this.baselineFrequencies = {}; // { word: averageCount }
    }

    calculateNovelty(word, currentMentions) {
        if (!word) return 0;

        const baseline = this.baselineFrequencies[word.toLowerCase()] || 0.5;
        const ratio = currentMentions / baseline;

        // Se il termine compare per la prima volta o ha un picco insolito -> Novelty alta!
        if (baseline <= 0.5 && currentMentions >= 5) {
            return 0.95; // Insolito ed emergente!
        }

        return Math.min(1.0, parseFloat((ratio / 10).toFixed(2)));
    }
}

module.exports = new NoveltyTrendEngine();
