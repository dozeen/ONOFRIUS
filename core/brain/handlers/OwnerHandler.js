if (numero === ownerConfig.owner) {

    if (ownerCommands.execute(context.text)) {

        bus.emit("message.reply", {

            context,

            response: `🧠 Gordon → ${stateManager.getMode()}`

        });

        return;

    }

}
