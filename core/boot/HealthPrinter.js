class HealthPrinter {

    print(report) {

        console.log("");

        console.log("══════════════════════════════════════");
        console.log("         ONOFRIUS HEALTH");
        console.log("══════════════════════════════════════");

        for (const s of report.services) {

            if (s.status === "OK") {

                console.log("✓", s.name);

            }

            else if (s.status === "WARN") {

                console.log("⚠", s.name, "-", s.message);

            }

            else {

                console.log("✖", s.name, "-", s.message);

            }

        }

        console.log("");

    }

}

module.exports = new HealthPrinter();
