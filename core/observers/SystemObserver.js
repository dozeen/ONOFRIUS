/**
 * SystemObserver.js - Monitoraggio continuo del sistema operativo e dei log di servizio
 */

const bus = require("../events/EventBus");
const logger = require("../logger");

class SystemObserver {
    constructor() {
        this.baseline = {
            cpuThreshold: 85,
            memThreshold: 90,
            errorKeywords: ["FAIL", "ERROR", "CRITICAL", "OutOfMemory", "Panic"]
        };
    }

    /**
     * Analizza una voce di log di sistema
     * @param {Object} logEntry - { source, message, level }
     */
    observeLog(logEntry) {
        if (!logEntry || !logEntry.message) return null;

        const msg = String(logEntry.message);
        const source = logEntry.source || "syslog";

        const isAnomaly = this.baseline.errorKeywords.some(kw => msg.toUpperCase().includes(kw));

        if (isAnomaly) {
            const anomalyEvent = {
                type: "system.anomaly",
                source: source,
                message: msg,
                severity: "HIGH",
                timestamp: new Date().toISOString()
            };

            logger.warn("SystemObserver", `⚠️ Anomalia di sistema rilevata [${source}]: ${msg}`);
            bus.emit("system.anomaly", anomalyEvent);
            return anomalyEvent;
        }

        return null;
    }
}

module.exports = SystemObserver;
