const AuditResult = require("../models/AuditResult");

module.exports = {

    async run() {

        const result = new AuditResult("Dependency Audit");

        // TODO:
        // Analizzerà dipendenze mancanti
        // require inutilizzati
        // dipendenze circolari

        return result;

    }

};
