/**
 * DailyReportEngine.js - Generatore di Report Giornaliero sui Fatti Appresi da Broadcast e Gruppi
 */

const FactRegistry = require("../cognition/facts/FactRegistry");

class DailyReportEngine {
    constructor(factRegistry) {
        this.factRegistry = factRegistry || new FactRegistry();
    }

    generateDailyReport(targetDateStr) {
        const today = targetDateStr || new Date().toISOString().split("T")[0];
        const allFacts = this.factRegistry.search("");

        const todayFacts = allFacts.filter(f => {
            const date = f.extracted_at || f.timestamp || f.lastObservedTimestamp || "";
            return date.includes(today);
        });

        const targetFacts = todayFacts.length > 0 ? todayFacts : allFacts.slice(-20);

        const problems = [];
        const actions = [];
        const generalFacts = [];

        for (const f of targetFacts) {
            const stmt = f.statement || "";
            const lower = stmt.toLowerCase();

            if (lower.includes("problema") || lower.includes("errore") || lower.includes("non avviato") || lower.includes("dxgk") || lower.includes("snap.docker")) {
                problems.push(stmt);
            } else if (lower.includes("azione") || lower.includes("eseguire") || lower.includes("aggiornare") || lower.includes("restart")) {
                actions.push(stmt);
            } else if (stmt !== "ok" && stmt !== "ok.") {
                generalFacts.push(stmt);
            }
        }

        let report = `📊 Report del Giorno — Fatti e Diagnostica Appresi da Broadcast e Gruppi (${today}):\n\n`;

        if (problems.length > 0) {
            report += `🚨 Problemi & Diagnostica Rilevata:\n`;
            problems.forEach(p => report += `• ${p}\n`);
            report += `\n`;
        }

        if (actions.length > 0) {
            report += `💡 Azioni Consigliate & Soluzioni:\n`;
            actions.forEach(a => report += `• ${a}\n`);
            report += `\n`;
        }

        if (generalFacts.length > 0) {
            report += `📝 Altri Fatti Appresi nel Corso della Giornata:\n`;
            generalFacts.slice(-10).forEach(g => report += `• ${g}\n`);
        }

        if (problems.length === 0 && actions.length === 0 && generalFacts.length === 0) {
            report += `Nessun evento critico o fatto rilevante appreso per la giornata di oggi.`;
        }

        return report.trim();
    }
}

module.exports = DailyReportEngine;
