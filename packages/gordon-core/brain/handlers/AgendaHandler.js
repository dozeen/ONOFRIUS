const AgendaEngine = require("../../agenda/AgendaEngine");
const AgendaContextSelector = require("../../agenda/AgendaContextSelector");
const AgendaPrivacyPolicy = require("../../agenda/AgendaPrivacyPolicy");

class AgendaHandler {
    isAgendaRelevant(context) {
        const text = (context.text || context.message || "").toLowerCase();
        const isAgendaCategory = context.inputClassification?.category === "AGENDA";
        const isEventClass = context.classification?.primary === "event";
        const isAgendaQuery = context.questionIntent?.isAgendaQuery;

        if (isAgendaCategory || isEventClass || isAgendaQuery) return true;

        const keywords = [
            "domani", "oggi", "stasera", "pomeriggio", "mattina", "lunedi", "lunedì",
            "martedi", "martedì", "mercoledi", "mercoledì", "giovedi", "giovedì",
            "venerdi", "venerdì", "sabato", "domenica", "alle ore", "alle ",
            "appuntamento", "riunione", "impegni", "agenda", "libero", "occupato",
            "orario", "quando", "calendario"
        ];

        return keywords.some(kw => text.includes(kw));
    }

    async process(context) {
        if (!this.isAgendaRelevant(context)) {
            console.log("📅 AgendaContext: Messaggio non inerente a date/appuntamenti -> skip caricamento agenda.");
            context.agenda = [];
            return context;
        }

        const fullAgenda = await AgendaEngine.buildCognitiveContext(context);
        const selectedAgenda = AgendaContextSelector.select(
            context,
            fullAgenda,
            { limit: 8 }
        );

        context.agenda = AgendaPrivacyPolicy.filter(
            context,
            selectedAgenda
        );

        console.log("");
        console.log("📅 AGENDA CONTEXT CARICATO");
        console.log("----------------------------");
        console.log(`Eventi disponibili: ${fullAgenda.length}`);
        console.log(`Eventi selezionati: ${context.agenda.length}`);

        for (const event of context.agenda) {
            console.log(
                `[${event.relevanceScore}]`,
                event.date,
                event.time || "ALL-DAY",
                "-",
                String(event.title || "").replace(/\s+/g, " ").slice(0, 120)
            );
        }

        console.log("----------------------------\n");
        return context;
    }
}

module.exports = AgendaHandler;
