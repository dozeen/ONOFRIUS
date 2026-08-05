class AuditRunner {

    constructor(audits) {

        this.audits = audits;

    }

    async run(reporter, report) {

        for (const audit of this.audits) {

            reporter.audit(audit.name);

            const result = await audit.fn();

            report.add(result);

            if (result.success)

                reporter.pass();

            else

                reporter.fail();

        }

    }

}

module.exports = AuditRunner;
