const fs = require("fs");

const LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4
};

const COLORS = {
    ERROR: "\x1b[31m",
    WARN: "\x1b[33m",
    INFO: "\x1b[36m",
    DEBUG: "\x1b[90m",
    TRACE: "\x1b[37m",
    RESET: "\x1b[0m"
};

class Logger {

    constructor() {

        const envLevel = (process.env.LOG_LEVEL || "INFO").toUpperCase();

        this.level = LEVELS[envLevel] ?? LEVELS.INFO;

        this.timers = new Map();

    }

    timestamp() {

        const now = new Date();

        return now.toISOString().replace("T", " ").replace("Z", "");

    }

    enabled(level) {

        return LEVELS[level] <= this.level;

    }

    write(level, scope, message) {

        if (!this.enabled(level))
            return;

        const color = COLORS[level] || "";
        const reset = COLORS.RESET;

        console.log(
            `${color}[${this.timestamp()}] ${level.padEnd(5)} [${scope}] ${message}${reset}`
        );

    }

    info(scope, message) {

        this.write("INFO", scope, message);

    }

    warn(scope, message) {

        this.write("WARN", scope, message);

    }

    debug(scope, message) {

        this.write("DEBUG", scope, message);

    }

    trace(scope, message) {

        this.write("TRACE", scope, message);

    }

    error(scope, err) {

        if (!this.enabled("ERROR"))
            return;

        const isWSL = fs.existsSync("/proc/version") && fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft");
        const errStr = (err instanceof Error ? err.message : String(err)) || "";

        if (isWSL && (errStr.includes("DBus") || errStr.includes("bus.cc") || errStr.includes("Failed to connect to the bus"))) {
            this.debug(scope, `[WSL DBus Suppressed] ${errStr}`);
            return;
        }

        if (err instanceof Error) {

            console.error(
                `${COLORS.ERROR}[${this.timestamp()}] ERROR [${scope}] ${err.message}${COLORS.RESET}`
            );

            if (this.level >= LEVELS.DEBUG)
                console.error(err.stack);

            return;

        }

        console.error(
            `${COLORS.ERROR}[${this.timestamp()}] ERROR [${scope}] ${err}${COLORS.RESET}`
        );

    }

    time(label) {

        this.timers.set(label, Date.now());

    }

    timeEnd(label, scope = "Timer") {

        if (!this.timers.has(label))
            return;

        const elapsed = Date.now() - this.timers.get(label);

        this.timers.delete(label);

        this.info(scope, `${label}: ${elapsed} ms`);

    }

}

module.exports = new Logger();
