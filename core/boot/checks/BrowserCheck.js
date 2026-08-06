const ServiceRegistry =
    require("../../services/ServiceRegistry");

const fs = require("fs");
const { execSync } = require("child_process");

const CANDIDATES = [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
    "/usr/bin/brave-browser"
];

class BrowserCheck {

    run(report) {

        for (const browser of CANDIDATES) {

            if (fs.existsSync(browser)) {

                report.ok("Browser");

                ServiceRegistry.register(
                    "Browser",
                    {
                        status: "ONLINE",
                        executablePath: browser
                    }
                );

                return browser;

            }

        }

        try {

            const path = execSync(
                "which google-chrome chromium chromium-browser microsoft-edge brave-browser 2>/dev/null",
                {
                    encoding: "utf8"
                }
            ).trim();

            if (path) {

                report.ok("Browser");

                ServiceRegistry.register(
                    "Browser",
                    {
                        status: "ONLINE",
                        executablePath: path
                    }
                );

                return path;

            }

        } catch (err) {

            // Browser non trovato

        }

        report.error(
            "Browser",
            "No supported Chromium browser found."
        );

        ServiceRegistry.register(
            "Browser",
            {
                status: "OFFLINE"
            }
        );

        return null;

    }

}

module.exports = new BrowserCheck();
