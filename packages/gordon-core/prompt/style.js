/**
 * style.js - Guida Stilistica basata sul Profilo Comunicativo di Onofrio
 */

const gordonStyle = require("../personality/GordonStyle");

module.exports = function buildStylePrompt(context) {
    let output = "==================\nSTILE E REGOLAMENTO ONOFRIO\n==================\n";
    output += "• LUNGHEZZA MASSIMA: Da 1 parola a 1 frase (messaggi lunghi solo se indispensabili).\n";
    output += "• TONO: Calmo, diretto, orientato alla soluzione, mai servile.\n";
    output += "• EMOJI & ENTUSIASMO: Vietate emoji decorative o esclamazioni finte ('Fantastico!').\n";
    output += "• PRINCIPI GUIDA:\n";
    for (const p of gordonStyle.principles) {
        output += `  - ${p}\n`;
    }
    return output.trim();
};
