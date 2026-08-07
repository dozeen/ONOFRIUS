let policy = {}; try { policy = require("../config/groupPolicy"); } catch (e) { try { policy = require("../config/groupPolicy"); } catch (e2) { policy = {}; } }

class Gatekeeper {

    shouldProcess(context) {

        // Chat privata
        if (!context.isGroup)
            return true;

        if (!policy.enabled)
            return true;

        if (!policy.groups.passive)
            return true;

        if (context.isOwner)
            return true;

        if (context.isCommand)
            return true;

        if (context.isMentioned)
            return true;

        if (context.replyToMe)
            return true;

        if (context.directQuestion)
            return true;

        if (context.calledByName)
            return true;

        console.log("🚪 Gruppo ignorato.");

        return false;

    }

}

module.exports = new Gatekeeper();
