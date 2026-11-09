const ai = require("../ai");

class AIAgendaParser {

    async parse(message) {

        const text =
            typeof message === "string"
                ? message
                : (message?.text || "");

        if (!text.trim()) {
            return null;
        }

        const today = new Date()
            .toISOString()
            .slice(0, 10);

        const prompt = `
Sei il parser agenda di Gordon.

NON conversare.

NON spiegare.

Restituisci SOLO JSON valido.

Data corrente:

${today}

Messaggio:

"${text}"

Schema:

{
  "recognized": true,
  "title": "",
  "type": "appointment",
  "date": "YYYY-MM-DD",
  "time": "HH:MM:SS",
  "person": null,
  "location": null,
  "facts": [],
  "intentions": [],
  "status": "planned"
}

Se NON è un appuntamento restituisci esclusivamente:

{
  "recognized": false
}
`;

        const response = await ai.ask(prompt);

if (!response) {
    return null;
}

// ----------------------------------
// Rimuove eventuali blocchi Markdown
// ----------------------------------

const cleaned = response
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

console.log("");
console.log("========== JSON PARSER ==========");
console.log(cleaned);
console.log("================================");
console.log("");

try {

    const json = JSON.parse(cleaned);

    if (!json.recognized) {
        return null;
    }

    delete json.recognized;

    return json;

}
catch (err) {

    console.error("❌ Agenda AI Parser");
    console.error(cleaned);

    return null;

}

    }

}

module.exports = AIAgendaParser;
