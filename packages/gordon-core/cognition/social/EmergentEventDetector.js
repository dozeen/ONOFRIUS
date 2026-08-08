/**
 * EmergentEventDetector.js - Rileva eventi emergenti correlati (es. ospedale + Antonio + ricovero)
 */

class EmergentEventDetector {
    detectEvents(history = []) {
        if (!history || history.length < 3) return null;

        const combinedText = history.slice(-15).map(h => h.text || "").join(" ").toLowerCase();

        // Correlazione Evento di Salute / Ospedale
        if (combinedText.includes("ospedale") || combinedText.includes("ricover") || combinedText.includes("ambulanz")) {
            const names = combinedText.match(/\b(antonio|pietro|christian|onofrio|lucia|silvana|sabino)\b/g) || [];
            const targetName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : "Un contatto";
            
            return {
                title: `${targetName} - Evento di salute / ricovero`,
                confidence: 0.85,
                category: "health_event",
                summary: `Segnali correlati rilevano un potenziale ricovero o visita per ${targetName}.`
            };
        }

        // Correlazione Organizzazione Evento / Festa
        if (combinedText.includes("festa") || combinedText.includes("serata") || combinedText.includes("matrimonio")) {
            return {
                title: "Organizzazione Evento / Serata in corso",
                confidence: 0.88,
                category: "event_organization",
                summary: "Discussione attiva per l'organizzazione di un evento."
            };
        }

        return null;
    }
}

module.exports = new EmergentEventDetector();
