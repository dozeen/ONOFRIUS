/**
 * style.js - Iniezione di Esempi Canonici Reali di Onofrio (Few-Shot Exemplars)
 */

const gordonStyle = require("../personality/GordonStyle");
const styleLearning = require("../learning/StyleLearningEngine");

module.exports = function buildStylePrompt(context) {
    const text = context.text || (context.event && context.event.text) || "";
    const exemplars = styleLearning.getCanonicalExemplars(text);

    let output = "==================\nESEMPI CANONICI REALI DI ONOFRIO\n==================\n";

    if (exemplars && exemplars.examples.length > 0) {
        output += `Per messaggi di tipo '${exemplars.speechAct.toUpperCase()}', Onofrio ha risposto in passato:\n`;
        for (const ex of exemplars.examples) {
            output += `  - "${ex}"\n`;
        }
        output += "Mantieni questo esatto stile, tono ed essenzialità.\n\n";
    }

    output += "• PRINCIPI GUIDA:\n";
    for (const p of gordonStyle.principles) {
        output += `  - ${p}\n`;
    }

    return output.trim();
};
