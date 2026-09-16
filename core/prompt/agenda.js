module.exports = function buildAgendaPrompt(context) {
    if (!context) return "";

    const agendaProb = context.agenda_probability || (context.agendaContext ? context.agendaContext.probability : 0);

    if (agendaProb < 0.7 && !context.isAgendaQuery) {
        return "";
    }

    const agendaContext = context.agendaContext;
    if (!agendaContext || !agendaContext.relevantEvents || agendaContext.relevantEvents.length === 0) {
        return "";
    }

    let output = "========================\nAGENDA & IMPEGNI\n========================\n";
    for (const evt of agendaContext.relevantEvents.slice(0, 3)) {
        output += `• ${evt.title || evt.summary} (${evt.date || evt.time || "Orario da definire"})\n`;
    }

    return output.trim();
};
