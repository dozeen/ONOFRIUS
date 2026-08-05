const Banner = require("./Banner");
const AuditLoader = require("./AuditLoader");
const Certification = require("./certification/Certification");

async function main() {

    const Reporter = require("./reporters/ConsoleReporter");

Banner.show();

Reporter.audit(audit.name);

    const cert = new Certification();

    const audits = AuditLoader.load();

    for (const audit of audits) {

        process.stdout.write("• " + audit.name + " ... ");

        try {

            const result = await audit.fn();

            const success = !!(result && result.success);

            cert.add(audit.name, success);

            console.log(success ? "PASS" : "FAIL");

        } catch (err) {

            cert.add(audit.name, false);

            console.log("ERROR");

            console.error(err.message);

        }

    }

    console.log("");

    if (cert.save("0.1.0-alpha")) {

        console.log("✅ RELEASE CERTIFIED");

    } else {

        console.log("❌ RELEASE NOT CERTIFIED");

        process.exit(1);

    }

}

main();
