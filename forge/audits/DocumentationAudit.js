const AuditResult = require("../models/AuditResult");

module.exports = {

    async run() {

        const result = new AuditResult("Documentation Audit");

        // TODO:
        // README
        // LICENSE
        // CHANGELOG
        // INSTALL

        return result;

    }

};
