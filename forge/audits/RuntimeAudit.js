const AuditResult = require("../models/AuditResult");

module.exports = {

    async run() {

        const result = new AuditResult("Runtime Audit");

        // TODO:
        // Verifica Node.js
        // Verifica package.json
        // Verifica file obbligatori
        // Verifica configurazione runtime

        return result;

    }

};
