module.exports = function (context) {

    const p = context.perception;

    if (!p)
        return "";

    const out = [];

    out.push("========================");
    out.push("PERCEPTION");
    out.push("========================");
    out.push("");

    if (p.intent)
        out.push(`Intento: ${p.intent}`);

    if (p.emotion)
        out.push(`Emozione: ${p.emotion}`);

    if (p.entities && p.entities.length) {

        out.push("");
        out.push("Elementi rilevanti:");

        for (const entity of p.entities) {

            out.push(`- ${entity}`);

        }

    }

    return out.join("\n");

};
