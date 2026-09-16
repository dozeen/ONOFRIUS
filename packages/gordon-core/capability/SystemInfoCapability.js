/**
 * SystemInfoCapability.js - Capability per Ora, Data, Identità & Info di Sistema
 * Risponde in modo deterministico a domande su Ora, Data e Identità (Zero Allucinazioni)
 */

class SystemInfoCapability {
    static cleanText(text) {
        if (!text || typeof text !== "string") return "";
        return text.replace(/[\"\']/g, " ").replace(/\\/g, " ").trim().toLowerCase();
    }

    static isSystemInfoQuery(text) {
        const lower = SystemInfoCapability.cleanText(text);
        if (!lower) return false;

        const isTimeOrDate = lower.match(/\b(che ore sono|che ora e|ridammi l ora|dammi l ora|ora attuale|che giorno e|che giorno e oggi|che data e|giorno oggi|data oggi)\b/i) !== null;
        const isIdentity = lower.match(/\b(come ti chiami|chi sei|chi sei tu|qual e il tuo nome|tu chi sei)\b/i) !== null;
        const isWeather = lower.match(/\b(meteo oggi|previsioni meteo|che tempo fa|che tempo fa oggi)\b/i) !== null;

        return isTimeOrDate || isIdentity || isWeather;
    }

    static executeAction(text) {
        const lower = SystemInfoCapability.cleanText(text);
        const now = new Date();

        // 1. Ora e Data
        if (lower.match(/\b(che ore sono|che ora e|ridammi l ora|dammi l ora|ora attuale|che giorno e|che giorno e oggi|che data e|giorno oggi|data oggi)\b/i)) {
            const timeStr = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toLocaleDateString("it-IT", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            return `🕒 Sono le ${timeStr} di ${dateStr}.`;
        }

        // 2. Identità
        if (lower.match(/\b(come ti chiami|chi sei|chi sei tu|qual e il tuo nome|tu chi sei)\b/i)) {
            return `🤖 Sono Gordon, il tuo agente assistente ed orchestratore cognitivo (ONOFRIUS OS).`;
        }

        // 3. Meteo
        if (lower.match(/\b(meteo oggi|previsioni meteo|che tempo fa|che tempo fa oggi)\b/i)) {
            return `🌤️ Per le previsioni meteo aggiornate in tempo reale per la tua zona, puoi consultare l'app meteo o il servizio meteo locale.`;
        }

        return null;
    }

    static async execute(context) {
        const text = context.text || (context.event && context.event.text) || "";

        if (SystemInfoCapability.isSystemInfoQuery(text)) {
            const replyText = SystemInfoCapability.executeAction(text);

            if (replyText) {
                context.response = replyText;
                context.skipLLM = true;

                return {
                    handled: true,
                    reply: replyText
                };
            }
        }

        return { handled: false };
    }
}

module.exports = SystemInfoCapability;
