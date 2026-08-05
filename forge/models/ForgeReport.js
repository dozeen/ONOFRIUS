class ForgeReport {

    constructor() {

        this.version = "";

        this.date = new Date().toISOString();

        this.audits = [];

    }

    add(result) {

        this.audits.push(result);

    }

}

module.exports = ForgeReport;
