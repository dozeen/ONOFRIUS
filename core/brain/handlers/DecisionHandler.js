const SocialPresence =
    require("../../social/SocialPresence");
class DecisionHandler {

async process(context) {

    // Nei gruppi Gordon ascolta, salva Event e apprende,
    // ma non invia mai risposte.
    if (context.isGroup) {

        console.log("👥 GROUP MODE -> listen only");

        context.response = null;
const social =
    SocialPresence.evaluate(context);

context.social = social;

if (social.shouldReply) {

    console.log("");
    console.log("👥 SOCIAL PRESENCE");
    console.log("----------------------------");
    console.log("Reason :", social.reason);
    console.log("Reply  :", social.reply);
    console.log("DEBUG  : nessun invio");
    console.log("----------------------------");
    console.log("");

}
        return context;

    }

    const result = context.capability;

        if (typeof result === "string") {

            context.response = result;

            return context;

        }

        if (result?.handled) {

            context.response =
                result.reply;

            return context;

        }

        return context;

    }

}

module.exports = DecisionHandler;
