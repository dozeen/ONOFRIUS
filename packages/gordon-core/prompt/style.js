/**
 * style.js - Iniezione di Esempi Canonici Reali di Onofrio (Few-Shot Exemplars)
 */

const styleLearning = require("../learning/StyleLearningEngine");

module.exports = function buildStylePrompt(context) {
    const text = context.text || (context.event && context.event.text) || "";
    const exemplars = styleLearning.getCanonicalExemplars(text);

    if (exemplars && exemplars.examples && exemplars.examples.length > 0) {
        let output = `==================\nESEMPI CANONICI REALI DI ONOFRIO\n==================\n`;
        for (const ex of exemplars.examples) {
            output += `• "${ex}"\n`;
        }
        return output.trim();
    }

    return "==================\nSTILE ONOFRIO\n==================\n• Orientato alla soluzione, italiano naturale, risposte brevi e concrete, zero cliché assistenziali.".trim();
};
