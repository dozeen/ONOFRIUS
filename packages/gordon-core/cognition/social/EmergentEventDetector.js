/**
 * EmergentEventDetector.js - Genera Ipotesi Emergenti con Evidenze (Inferred Context)
 */

class EmergentEventDetector {
    detectEvents(history = []) {
        if (!history || history.length < 3) return null;

        const messages = history.slice(-15);
        const combinedText = messages.map(h => h.text || "").join(" ").toLowerCase();

        // Correlazione Evento di Salute / Ospedale
        if (combinedText.includes("ospedale") || combinedText.includes("ricover") || combinedText.includes("ambulanz")) {
            const names = combinedText.match(/\b(contattoc|antonio|pietro|christian|onofrio|lucia|silvana|sabino)\b/g) || [];
            const rawName = names[0] || "Un contatto";
            let targetName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            if (targetName === "Contattoc") targetName = "ContattoC";

            const evidence = [];
            if (combinedText.includes("ambulanz")) evidence.push("ambulanza");
            if (combinedText.includes("ospedale")) evidence.push("ospedale");
            if (combinedText.includes("preghiamo") || combinedText.includes("speriamo")) evidence.push("preghiamo");

            return {
                type: "emergent_hypothesis",
                title: `Possibile problema di salute che coinvolge ${targetName}`,
                confidence: 0.85,
                evidence,
                category: "health_event"
            };
        }

        // Correlazione Organizzazione Evento / Festa
        if (combinedText.includes("festa") || combinedText.includes("serata") || combinedText.includes("matrimonio")) {
            return {
                type: "emergent_hypothesis",
                title: "Ipotesi: Pianificazione di un evento sociale o serata",
                confidence: 0.88,
                evidence: ["festa", "serata", "organizz"],
                category: "event_organization"
            };
        }

        return null;
    }
}

module.exports = new EmergentEventDetector();
