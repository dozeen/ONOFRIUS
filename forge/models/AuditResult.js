class AuditResult {

    constructor(name) {

        this.name = name;

        this.success = true;

        this.critical = [];

        this.warnings = [];

        this.infos = [];

    }

    fail(message) {

        this.success = false;

        this.critical.push(message);

    }

    warn(message) {

        this.warnings.push(message);

    }

    info(message) {

        this.infos.push(message);

    }

}

module.exports = AuditResult;
