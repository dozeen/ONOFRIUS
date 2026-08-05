class HealthReport {

    constructor() {

        this.services = [];

    }

    ok(name) {

        this.services.push({
            status: "OK",
            name
        });

    }

    warn(name, message) {

        this.services.push({
            status: "WARN",
            name,
            message
        });

    }

    error(name, message) {

        this.services.push({
            status: "ERROR",
            name,
            message
        });

    }

}

module.exports = HealthReport;
