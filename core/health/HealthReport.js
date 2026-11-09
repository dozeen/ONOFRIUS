class HealthReport {

    constructor() {

        this.services = [];

    }

    ok(name) {

        this.services.push({
            name,
            status: "OK"
        });

    }

    warn(name, message) {

        this.services.push({
            name,
            status: "WARN",
            message
        });

    }

    error(name, message) {

        this.services.push({
            name,
            status: "ERROR",
            message
        });

    }

}

module.exports = HealthReport;
