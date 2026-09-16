/**
 * PersonalityEngine.js - Motore Identitario di Gordon
 */

const conscience = require("./LinguisticConscience");
const style = require("./GordonStyle");

class PersonalityEngine {
    constructor() {
        this.style = style;
        this.conscience = conscience;
    }

    sanitize(response) {
        return this.conscience.evaluate(response);
    }

    evalLinguisticConscience(response) {
        return this.conscience.evaluate(response);
    }

    generateGreeting(moodContext) {
        const mood = moodContext.mood || "casual";
        const isOwner = moodContext.isOwner;
        const isLongText = moodContext.isLongText;

        if (isLongText) {
            return "Ho letto tutto. Dimmi pure.";
        }

        switch (mood) {
            case "return_after_hours":
                return isOwner ? "Bentornato. Dimmi." : "Bentornato.";

            case "owner_message":
                return "Dimmi.";

            case "first_contact":
                return "Buongiorno. C'è qualcosa di nuovo?";

            case "technical_discussion":
                return "Ti ascolto. Raccontami.";

            case "ritual":
            default:
                const options = [
                    "Buongiorno.",
                    "Buongiorno. Come va?",
                    "Dimmi.",
                    "Eccomi."
                ];
                const choiceIndex = Math.floor(Math.random() * options.length);
                return options[choiceIndex];
        }
    }

    format(response, context = {}) {
        if (!response) return response;

        let formatted = this.conscience.evaluate(response);

        if (!formatted || formatted.length === 0) {
            return "Va bene.";
        }

        return formatted;
    }
}

module.exports = new PersonalityEngine();
