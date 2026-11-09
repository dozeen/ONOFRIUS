const CapabilityRegistry =
    require("./CapabilityRegistry");

class CapabilityRouter {

    async execute(context) {

        const capability =
            context.classification?.primary;

        const engine =
            CapabilityRegistry.get(capability);

        if (engine && typeof engine.execute === "function") {

            const result =
                await engine.execute(context);

            if (result?.handled)
                return result;

        }

        return {
            handled: false
        };

    }

}

module.exports = new CapabilityRouter();
