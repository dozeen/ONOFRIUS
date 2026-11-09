const ConfigManager = require("../config/ConfigManager");

class Gatekeeper {
    shouldProcess(context) {
        if (!context.isGroup) return true;

        const policy = ConfigManager.groupPolicy();
        if (!policy.enabled) return true;
        if (policy.groups && !policy.groups.passive) return true;
        if (context.isOwner) return true;
        if (context.isCommand) return true;
        if (context.isMentioned) return true;
        if (context.replyToMe) return true;
        if (context.directQuestion) return true;
        if (context.calledByName) return true;

        console.log("🚪 Gruppo ignorato.");
        return false;
    }
}

module.exports = new Gatekeeper();
