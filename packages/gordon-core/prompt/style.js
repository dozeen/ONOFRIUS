/**
 * style.js - Iniezione di Esempi Canonici Reali e Direttive Dinamiche di Tono (ToneEngine)
 */

const styleLearning = require("../learning/StyleLearningEngine");
const toneEngine = require("../personality/ToneEngine");

module.exports = function buildStylePrompt(context) {
    const text = context.text || (context.event && context.event.text) || "";
    const exemplars = styleLearning.getCanonicalExemplars(text);
    const toneInfo = toneEngine.evaluateTone(context);

    let output = "";

    if (exemplars && exemplars.examples && exemplars.examples.length > 0) {
        output += `==================\nESEMPI CANONICI REALI DI ONOFRIO\n==================\n`;
        for (const ex of exemplars.examples) {
            output += `• "${ex}"\n`;
        }
        output += "\n";
    }

    output += `==================\nREGISTRO E TONO: ${toneInfo.tone.toUpperCase()}\n==================\n`;
    output += `• ${toneInfo.instruction}\n`;
    output += `• DIRETTIVA SUPREMA: Non cercare sempre di essere utile. Se il messaggio è affettuoso, ironico o scherzoso, rispondi con la stessa complicità. Non trasformare mai la chat in un dialogo assistenziale o professionale.`;

    return output.trim();
};
