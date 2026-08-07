module.exports = function buildFactsPrompt(context) {
    if (!context || !context.facts || !Array.isArray(context.facts) || context.facts.length === 0) {
        return "";
    }

    const relevantFacts = context.facts.filter(f => f && (f.confidence === undefined || f.confidence > 0.7));

    if (relevantFacts.length === 0) return "";

    let output = "========================\nFATTI PERTINENTI\n========================\n";
    for (const fact of relevantFacts.slice(0, 5)) {
        const text = typeof fact === "string" ? fact : (fact.statement || fact.text || "");
        if (text) {
            output += `• ${text}\n`;
        }
    }

    return output.trim();
};
