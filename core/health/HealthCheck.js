const fs = require("fs");

class HealthCheck {

    constructor() {
        this.results = [];
    }

    ok(name) {
        this.results.push({
            name,
            ok: true
        });
    }

    warn(name, message) {
        this.results.push({
            name,
            ok: false,
            message
        });
    }

    print() {

        console.log("");
        console.log("══════════════════════════════════════");
        console.log("          ONOFRIUS HEALTH");
        console.log("══════════════════════════════════════");

        for (const r of this.results) {

            if (r.ok)
                console.log("✓", r.name);
            else
                console.log("⚠", r.name, "-", r.message);

        }

        console.log("");

    }

}

module.exports = HealthCheck;
