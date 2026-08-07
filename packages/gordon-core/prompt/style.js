/**
 * style.js - Sezione STYLE semplificata per PromptBuilder
 */

const gordonStyle = require("../personality/GordonStyle");

module.exports = function buildStylePrompt(context) {
    let output = "==================\nCOSCIENZA LINGUISTICA ONOFRIO\n==================\n";
    output += "• LUNGHEZZA MASSIMA: Da 1 parola a 1 frase.\n";
    output += "• COSCIENZA LINGUISTICA: Valuta se questa risposta sarebbe stata realmente scritta da Onofrio. Se un solo dettaglio suona artificiale o assistenziale, riscrivila.\n";
    output += "• PRINCIPI GUIDA:\n";
    for (const p of gordonStyle.principles) {
        output += `  - ${p}\n`;
    }
    return output.trim();
};
