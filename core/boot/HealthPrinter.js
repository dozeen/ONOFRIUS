const ServiceRegistry = require("../services/ServiceRegistry");

class HealthPrinter {

    print(report) {

        console.log("");

        console.log("══════════════════════════════════════");
        console.log("         ONOFRIUS HEALTH");
        console.log("══════════════════════════════════════");

        const services = ServiceRegistry.list();

        if (services.length > 0) {

            for (const service of services) {

                const icon =
                    service.status === "ONLINE"
                        ? "✓"
                        : service.optional
                            ? "⚠"
                            : "✖";

                console.log(icon, service.name);

            }

        } else {

            // Compatibilità con il vecchio HealthReport

            for (const s of report.services) {

                if (s.status === "OK") {

                    console.log("✓", s.name);

                } else if (s.status === "WARN") {

                    console.log("⚠", s.name, "-", s.message);

                } else {

                    console.log("✖", s.name, "-", s.message);

                }

            }

        }

        console.log("");

    }

}

module.exports = new HealthPrinter();
