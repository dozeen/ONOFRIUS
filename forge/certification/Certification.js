const fs = require("fs");

class Certification {

    constructor() {

        this.tests = [];

    }

    add(name, passed) {

        this.tests.push({
            name,
            passed
        });

    }

    save(version = "0.1.0-alpha") {

        const ok = this.tests.every(t => t.passed);

        const certificate = {

            framework: "ONOFRIUS",

            version,

            generated: new Date().toISOString(),

            certified: ok,

            tests: this.tests

        };

        fs.writeFileSync(

            "ONOFRIUS_CERTIFICATE.json",

            JSON.stringify(certificate, null, 4)

        );

        return ok;

    }

}

module.exports = Certification;
