module.exports = function (context) {

    const agenda = context?.agenda;

    if (!Array.isArray(agenda) || agenda.length === 0) {
        return "";
    }

    // =====================================================
    // AGENDA CONTESTUALE
    // =====================================================

    const text =
        String(context?.text || "")
            .toLowerCase();

    const triggers = [

        "quando",
        "oggi",
        "domani",
        "ieri",
        "dopodomani",

        "lunedì",
        "martedì",
        "mercoledì",
        "giovedì",
        "venerdì",
        "sabato",
        "domenica",

        "gennaio",
        "febbraio",
        "marzo",
        "aprile",
        "maggio",
        "giugno",
        "luglio",
        "agosto",
        "settembre",
        "ottobre",
        "novembre",
        "dicembre",

        "ore",
        "alle",

        "appuntamento",
        "agenda",
        "calendario",
        "riunione",
        "impegno",
        "promemoria",
        "ricordami",
        "ricordati",

        "compleanno",
        "festa",

        "ci vediamo",
        "vediamoci"

    ];

    const needsAgenda =
        triggers.some(word => text.includes(word));

    if (!needsAgenda) {
        return "";
    }

    // =====================================================
    // PROMPT
    // =====================================================

    const now = new Date();

    const today =
        `${now.getFullYear()}-` +
        `${String(now.getMonth() + 1).padStart(2, "0")}-` +
        `${String(now.getDate()).padStart(2, "0")}`;

    const sections = [];

    sections.push(`
========================
AGENDA ED EVENTI
========================

DATA CORRENTE: ${today}

Questa sezione contiene informazioni persistenti
registrate nel sistema di Gordon.

Usala SOLO se è utile per rispondere
all'ultimo messaggio.

Ignorala completamente se il messaggio
non riguarda appuntamenti, date, orari,
impegni o eventi.

Non introdurre spontaneamente argomenti
presi dall'agenda.

REGOLE:

- Non inventare date.
- Non inventare orari.
- Non modificare eventi.
- Non trasformare intenzioni in fatti.
- Usa l'agenda solo quando pertinente.
`);

    for (const event of agenda) {

        const lines = [];

        lines.push("------------------------");
        lines.push(`EVENTO: ${event.title || "Evento"}`);

        if (event.type)
            lines.push(`TIPO: ${event.type}`);

        if (event.date)
            lines.push(`DATA: ${event.date}`);

        if (event.time)
            lines.push(`ORA: ${event.time}`);

        if (event.person)
            lines.push(`PERSONA: ${event.person}`);

        if (event.status)
            lines.push(`STATO: ${event.status}`);

        if (Number.isFinite(event.temporalDistance)) {

            const days =
                Math.round(
                    event.temporalDistance /
                    (1000 * 60 * 60 * 24)
                );

            if (days === 0)
                lines.push("DISTANZA TEMPORALE: oggi");
            else if (days === 1)
                lines.push("DISTANZA TEMPORALE: domani");
            else if (days > 1)
                lines.push(`DISTANZA TEMPORALE: tra circa ${days} giorni`);
            else if (days === -1)
                lines.push("DISTANZA TEMPORALE: ieri");
            else
                lines.push(`DISTANZA TEMPORALE: circa ${Math.abs(days)} giorni fa`);
        }

        if (event.facts?.length) {

            lines.push("FATTI:");

            for (const fact of event.facts)
                lines.push(`- ${fact}`);

        }

        if (event.intentions?.length) {

            lines.push("INTENZIONI DI ONOFRIO:");

            for (const item of event.intentions)
                lines.push(`- ${item}`);

        }

        if (event.evidence?.length) {

            lines.push("EVIDENZE:");

            for (const item of event.evidence)
                lines.push(`- ${item}`);

        }

        sections.push(lines.join("\n"));

    }

    return sections.join("\n\n");

};
