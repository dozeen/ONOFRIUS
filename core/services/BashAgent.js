class BashAgent {

    async execute(command) {

        return {
            success: false,
            disabled: true,
            message: "BashAgent is not available in this release."
        };

    }

}

module.exports = BashAgent;
