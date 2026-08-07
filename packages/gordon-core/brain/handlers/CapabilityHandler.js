const capabilityRouter =
    require("../../capability/CapabilityRouter");

class CapabilityHandler {

    async process(context) {

        console.log("");
        console.log("========== CAPABILITY ==========");

        console.log("Classification:");

        console.dir(
            context.classification,
            { depth: null }
        );

        context.capability =
            await capabilityRouter.execute(context);

        console.log("");
        console.log("Capability result:");

        console.dir(
            context.capability,
            { depth: null }
        );

        console.log("===============================");
        console.log("");

        return context;

    }

}

module.exports = CapabilityHandler;
