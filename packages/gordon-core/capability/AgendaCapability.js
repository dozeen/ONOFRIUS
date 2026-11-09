/**
 * AgendaCapability.js - Intent Parser & Deterministic Execution Engine per l'Agenda
 * Esegue in modo deterministico le interrogazioni sull'agenda (Zero LLM Tokens, Zero Allucinazioni)
 */

const AgendaEngine = require("../agenda/AgendaEngine");

class AgendaCapability {
    static cleanText(text) {
        if (!text || typeof text !== "string") return "";
        return text.replace(/[\"\']/g, " ").replace(/\\/g, " ").trim().toLowerCase();
    }

    static isAgendaQuery(text) {
        const lower = AgendaCapability.cleanText(text);
        if (!lower) return false;
        return lower.match(/\b(appuntamento|appuntamenti|agenda|calendario|eventi|promemoria|impegno|impegni|programma|cosa devo fare|cosa ho da fare|cosa ho oggi|cosa ho domani|prossimi appuntamenti|prossimi impegni|prossimi|agenda futura)\b/i) !== null;
    }

    static getTargetDate(text) {
        const lower = AgendaCapability.cleanText(text);
        const today = new Date().toISOString().split("T")[0];

        if (lower.includes("domani")) {
            const tom = new Date();
            tom.setDate(tom.getDate() + 1);
            return tom.toISOString().split("T")[0];
        }
        return today;
    }

    static executeDeterministic(text) {
        const lower = AgendaCapability.cleanText(text);
        const today = new Date().toISOString().split("T")[0];
        const allEvents = AgendaEngine.getGlobal();

        // 1. Prossimi N appuntamenti (es. "i prossimi 5 appuntamenti")
        if (lower.includes("prossim") || lower.includes("futur")) {
            const countMatch = lower.match(/\b(\d+)\b/);
            const limit = countMatch ? parseInt(countMatch[1]) : 5;

            const futureEvents = allEvents
                .filter(e => e.date >= today)
                .sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")))
                .slice(0, limit);

            if (futureEvents.length === 0) {
                return `Non ci sono prossimi appuntamenti registrati in agenda.`;
            }

            let output = `📅 *I prossimi ${futureEvents.length} appuntamenti in agenda*:\n\n`;
            for (const e of futureEvents) {
                const dateParts = e.date ? e.date.split("-") : [];
                const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : e.date;
                const timeStr = e.time ? `${e.time}` : "Tutto il giorno";
                output += `• *${formattedDate}* (${timeStr}): ${e.title}${e.person ? ' (con ' + e.person + ')' : ''}\n`;
            }
            return output.trim();
        }

        const targetDate = this.getTargetDate(text);
        const isTomorrow = lower.includes("domani");
        const dateLabel = isTomorrow ? "domani" : "oggi";

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
