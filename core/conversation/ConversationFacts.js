const Fact = require("./Fact");
const TYPES = require("./FactTypes");

class ConversationFacts {

    extract(message) {

        const facts = [];

        const text = (message.text || "").toLowerCase();

        if (text.includes("mulata")) {

            facts.push(

                new Fact(

                    TYPES.PLACE,

                    "meeting.place",

                    "Mulata"

                )

            );

        }

        if (text.match(/\b22(:15)?\b/)) {

            facts.push(

                new Fact(

                    TYPES.TIME,

                    "meeting.time",

                    "22:15"

                )

            );

        }

        return facts;

    }

}

module.exports = ConversationFacts;
