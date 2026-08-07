/**
 * BashAgent.js - Agente di Diagnostica di Sistema (Read-Only)
 * 
 * Esegue comandi di sola lettura (systemctl, journalctl, docker, df, free, top, git)
 * ed emette SystemEvent via EventBus. NON esegue modifiche dirette.
 */

const { exec } = require("child_process");
const bus = require("../../core/events/EventBus");
const logger = require("../../core/logger");

const ALLOWED_READ_COMMANDS = new Set([
    "journalctl", "systemctl status", "docker ps", "df", "free", "uptime", "top", "git status"
]);

class BashAgent {
    constructor() {}

    /**
     * Esegue un comando di diagnostica in sola lettura
     * @param {string} cmd
     * @returns {Promise<Object>} { success, stdout, stderr, event }
     */
    async executeDiagnostic(cmd) {
        if (!cmd || typeof cmd !== "string") {
            throw new Error("Comando mancante");
        }

        const trimmed = cmd.trim();
        const baseCmd = trimmed.split(" ")[0];

        // Validazione sicurezza Read-Only
        const isAllowed = Array.from(ALLOWED_READ_COMMANDS).some(allowed => trimmed.startsWith(allowed));
        if (!isAllowed) {
            const errReason = `Comando non autorizzato per BashAgent (solo lettura): ${trimmed}`;
            logger.warn("BashAgent", `⛔ ${errReason}`);
            throw new Error(errReason);
        }

        logger.info("BashAgent", `🔍 Esecuzione diagnostica: "${trimmed}"`);

        return new Promise((resolve, reject) => {
            exec(trimmed, { timeout: 10000 }, (error, stdout, stderr) => {
                const systemEvent = {
                    type: "system.bash.diagnostic",
                    command: trimmed,
                    success: !error,
                    output: stdout.trim(),
                    error: stderr.trim(),
                    timestamp: new Date().toISOString()
                };

                bus.emit("system.bash.diagnostic", systemEvent);

                if (error) {
                    logger.error("BashAgent", `Errore comando ${trimmed}: ${error.message}`);
                    resolve({ success: false, stdout, stderr: error.message, event: systemEvent });
                } else {
                    logger.info("BashAgent", `✅ Diagnostica completata per: ${trimmed}`);
                    resolve({ success: true, stdout: stdout.trim(), stderr, event: systemEvent });
                }
            });
        });
    }
}

module.exports = BashAgent;
