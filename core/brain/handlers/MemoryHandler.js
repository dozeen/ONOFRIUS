const MemoryEngine =
    require("../../memory/memoryEngine");

class MemoryHandler {

    constructor() {

        this.memory =
            new MemoryEngine();

    }

    async process(context) {

        context.memory =
            await this.memory.buildContext(
                context.chatId
            );

        return context;

    }

}

module.exports = MemoryHandler;
