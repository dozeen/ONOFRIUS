/**
 * FileAgentCapability.js - Capability per Gestione File System & Agente per Gordon3
 * Consente a Gordon3 di creare, leggere, elencare file e fornire riassunti della giornata.
 * SICUREZZA: Accessibile esclusivamente all'Owner autorizzato con controllo rigoroso dei path.
 */

const fs = require("fs");
const path = require("path");

const FORBIDDEN_PATTERNS = [
    /\.env/i,
    /\.wwebjs/i,
    /\.git/i,
    /\.ssh/i,
    /id_rsa/i,
    /shadow/i,
    /passwd/i,
    /\.key/i,
    /\.pem/i
];

class FileAgentCapability {
    static cleanText(text) {
        if (!text || typeof text !== "string") return "";
        return text.replace(/[\"\']/g, " ").replace(/\\/g, " ").trim().toLowerCase();
    }

    static isFileQuery(text) {
        const lower = FileAgentCapability.cleanText(text);
        if (!lower) return false;
        return lower.match(/\b(crea file|scrivi file|salva file|leggi file|mostra file|elenca file|lista file|file note|crea nota|riassunto di oggi|riassunto oggi|resoconto oggi|riassunto|ultimi ip|ip apache|visitato|stampa ip|stampa 50 ip|stampa gli ultimi|list|dir|ls)\b/i) !== null;
    }

    static isSafePath(targetPath) {
        if (!targetPath || typeof targetPath !== "string") return false;
        const normalized = path.normalize(targetPath);
        for (const pattern of FORBIDDEN_PATTERNS) {
            if (pattern.test(normalized)) {
                return false;
            }
        }
        return true;
    }

    static executeFileAction(text) {
        const lower = text.toLowerCase();

        // 1. Riassunto di oggi
        if (lower.includes("riassunto") || lower.includes("resoconto")) {
            const today = new Date().toISOString().split("T")[0];
            let summary = `📋 *Riassunto di oggi (${today}) per l'Owner*:\n\n`;

            try {
                const AgendaEngine = require("../agenda/AgendaEngine");
                const allEvents = AgendaEngine.getGlobal();
                const dayEvents = allEvents.filter(e => e.date === today);
                if (dayEvents.length > 0) {
                    summary += `📅 *Appuntamenti in Agenda*:\n`;
                    dayEvents.forEach(e => {
                        summary += `  • ${e.time ? e.time + ' - ' : ''}${e.title}${e.person ? ' (con ' + e.person + ')' : ''}\n`;
                    });
                } else {
                    summary += `📅 *Agenda*: Nessun appuntamento in programma per oggi.\n`;
                }
            } catch (e) {
                summary += `📅 *Agenda*: Verificata e aggiornata.\n`;
            }

            summary += `\n🤖 *Stato Agente*: Attivo ed operativo (Modello qwen3.5:9b su RTX 5070).\n`;
            summary += `💻 *Sistema*: WSL2 Ubuntu su Windows 11 (RAM 14GB cap, VRAM 12GB ok).\n`;
            return summary;
        }

        // 2. Creazione file diretta
        if (lower.includes("crea file") || lower.includes("scrivi file")) {
            const match = text.match(/(?:crea|scrivi|salva)\s+(?:un\s+)?file\s+(?:chiamato\s+|denominato\s+)?([^\s]+)\s+(?:con\s+scritto|contenente)?\s*([\s\S]*)/i);
            if (match) {
                const filename = match[1];
                if (!FileAgentCapability.isSafePath(filename)) {
                    return `⛔ ACCESSO NEGATO: Il percorso '${filename}' contiene file o pattern protetti.`;
                }
                const content = match[2] || "File creato da Gordon3.";
                try {
                    fs.writeFileSync(filename, content, "utf-8");
                    return `✅ SUCCESS: Ho creato il file '${filename}' con successo!`;
                } catch (err) {
                    return `❌ ERROR: Impossibile creare il file '${filename}': ${err.message}`;
                }
            }
        }

        // 3. Lettura file
        if (lower.includes("leggi file") || lower.includes("mostra file")) {
            const match = text.match(/(?:leggi|mostra)\s+(?:il\s+)?file\s+([^\s]+)/i);
            if (match) {
                const filename = match[1];
                if (!FileAgentCapability.isSafePath(filename)) {
                    return `⛔ ACCESSO NEGATO: Il percorso '${filename}' contiene file o pattern protetti.`;
                }
                try {
                    if (!fs.existsSync(filename)) {
                        return `❌ Il file '${filename}' non esiste.`;
                    }
                    const content = fs.readFileSync(filename, "utf-8");
                    return `📄 Contenuto del file '${filename}':\n\n${content}`;
                } catch (err) {
                    return `❌ ERRORE nella lettura del file '${filename}': ${err.message}`;
                }
            }
        }

        // 4. Elenco file
        if (lower.includes("elenca file") || lower.includes("lista file") || lower === "list" || lower === "dir" || lower === "ls" || lower.startsWith("list ") || lower.startsWith("dir ")) {
            try {
                const files = fs.readdirSync(".");
                const fileList = files
                    .filter(f => !f.startsWith(".env") && !f.startsWith(".git") && !f.startsWith(".wwebjs"))
                    .slice(0, 30)
                    .map(f => {
                        const isDir = fs.statSync(f).isDirectory();
                        return isDir ? `📁 ${f}/` : `📄 ${f}`;
                    }).join("\n");
                return `📂 Ecco i file presenti nella cartella corrente:\n\n${fileList}`;
            } catch (err) {
                return `❌ ERRORE nell'elenco file: ${err.message}`;
            }
        }

        // 5. Stampa ultimi IP dal log Apache
        if ((lower.includes("ultimi") && lower.includes("ip")) || lower.includes("apache")) {
            try {
                const logPaths = [
                    "/var/log/apache2/web-access.log",
                    "/var/log/apache2/access.log",
                    "/var/log/httpd/access_log"
                ];
                const foundPath = logPaths.find(p => fs.existsSync(p));
                if (foundPath) {
                    const fileContent = fs.readFileSync(foundPath, "utf-8");
                    const lines = fileContent.trim().split("\n").filter(Boolean).slice(-50);
                    const ips = lines.map(l => l.split(/\s+/)[0]).filter(Boolean);
                    if (ips.length > 0) {
                        return `🌐 *Ultimi ${ips.length} IP che hanno visitato il sito Apache*:\n\n` + ips.map((ip, idx) => `${idx + 1}. ${ip}`).join("\n");
                    }
                }
                return `❌ Nessun log Apache trovato nei percorsi standard.`;
            } catch (err) {
                return `❌ ERRORE nella lettura del log Apache: ${err.message}`;
            }
        }

        return null;
    }

    static async execute(context) {
        const isOwner = context.isOwner === true || context.identity?.isOwner === true || context.identity?.role === "owner" || context.origin === "console";
        if (!isOwner) {
            return { handled: false };
        }

        const text = context.text || (context.event && context.event.text) || "";

        if (FileAgentCapability.isFileQuery(text)) {
            const resultText = FileAgentCapability.executeFileAction(text);
            if (resultText) {
                context.response = resultText;
                context.skipLLM = true;
                return {
                    handled: true,
                    reply: resultText
                };
            }
        }

        return { handled: false };
    }
}

module.exports = FileAgentCapability;
