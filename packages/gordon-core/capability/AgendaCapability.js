/**
 * AgendaCapability.js - Intent Parser & Deterministic Execution Engine per l'Agenda
 * Esegue in modo deterministico le interrogazioni sull'agenda (Zero LLM Tokens, Zero Allucinazioni)
 */

const AgendaEngine = require("../agenda/AgendaEngine");

class AgendaCapability {
    static isAgendaQuery(text) {
        if (!text || typeof text !== "string") return false;
        const lower = text.trim().toLowerCase();
        return lower.match(/\b(appuntamento|appuntamenti|agenda|calendario|eventi|promemoria|impegno|impegni|programma|cosa devo fare|cosa ho da fare|cosa ho oggi|cosa ho domani)\b/i) !== null;
    }

    static getTargetDate(text) {
        const lower = (text || "").toLowerCase();
        const today = new Date().toISOString().split("T")[0];

        if (lower.includes("domani")) {
            const tom = new Date();
            tom.setDate(tom.getDate() + 1);
            return tom.toISOString().split("T")[0];
        }
        return today;
    }

    static executeDeterministic(text) {
        const targetDate = this.getTargetDate(text);
        const isTomorrow = text.toLowerCase().includes("domani");
        const dateLabel = isTomorrow ? "domani" : "oggi";

        const allEvents = AgendaEngine.getGlobal();

        // Filtra eventi per la data target
        const dayEvents = allEvents.filter(e => e.date === targetDate);

        if (dayEvents.length === 0) {
            return `Per ${dateLabel} non hai appuntamenti in agenda.`;
        }

        let output = `Hai i seguenti appuntamenti per ${dateLabel}:\n\n`;
        for (const e of dayEvents) {
            const timeStr = e.time ? `${e.time} - ` : "";
            output += `• ${timeStr}${e.title}${e.person ? ' (con ' + e.person + ')' : ''}\n`;
        }

        return output.trim();
    }

    static async execute(context) {
        const text = context.text || (context.event && context.event.text) || "";

        if (AgendaCapability.isAgendaQuery(text)) {
            const replyText = AgendaCapability.executeDeterministic(text);

            context.response = replyText;
            context.skipLLM = true;

            return {
                handled: true,
                reply: replyText
            };
        }

        return { handled: false };
    }
}

module.exports = AgendaCapability;
