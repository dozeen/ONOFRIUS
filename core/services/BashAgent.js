const Registry = require("./ServiceRegistry");

class NullBashAgent {

    async execute() {

        return {

            success: false,

            reason: "Bash Agent not installed"

        };

    }

}

module.exports = Registry.resolve("BashAgent") || new NullBashAgent();
