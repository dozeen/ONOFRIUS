const AgendaEngine =
    require("../../agenda/AgendaEngine");

const AgendaContextSelector =
    require("../../agenda/AgendaContextSelector");

const AgendaPrivacyPolicy =
    require("../../agenda/AgendaPrivacyPolicy");

class AgendaHandler {

    async process(context) {

        const fullAgenda =
            await AgendaEngine.buildCognitiveContext(context);

        const selectedAgenda =
            AgendaContextSelector.select(
                context,
                fullAgenda,
                {
                    limit: 8
                }
            );

        context.agenda =
            AgendaPrivacyPolicy.filter(
                context,
                selectedAgenda
            );

        console.log("");
        console.log("📅 AGENDA CONTEXT");
        console.log("----------------------------");
        console.log(
            `Eventi disponibili: ${fullAgenda.length}`
        );
        console.log(
            `Eventi selezionati: ${context.agenda.length}`
        );

        for (const event of context.agenda) {

            console.log(
                `[${event.relevanceScore}]`,
                event.date,
                event.time || "ALL-DAY",
                "-",
                String(event.title || "")
                    .replace(/\s+/g, " ")
                    .slice(0, 120)
            );

        }

        console.log("----------------------------");
        console.log("");

        console.log(
    "DEBUG agenda nel context:",
    context.agenda.length
);
return context;

    }

}

module.exports = AgendaHandler;
