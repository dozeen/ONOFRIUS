const TYPES = require("./MessageType");

class MessageClassifier {

    static classify(message){

        const text = (message.text || "").toLowerCase();

        // domanda

        if(text.includes("?"))
            return {
                primary: TYPES.QUESTION,
                confidence: 0.95
            };

        // task

        if(text.includes("ricordami"))
            return {
                primary: TYPES.TASK,
                confidence: 0.98
            };

        // evento

        if(text.match(/\b(domani|oggi|stasera|alle\s+\d+)/))
            return {
                primary: TYPES.EVENT,
                confidence: 0.90
            };

        // notizia

        if(text.includes("terremoto")
        || text.includes("condoglianze")
        || text.includes("morto"))
            return {
                primary: TYPES.NEWS,
                confidence: 0.90
            };

        // fatto

        if(text.includes(" è ")
        || text.includes(" e'")
        || text.includes("sono"))
            return {
                primary: TYPES.FACT,
                confidence: 0.70
            };

        // emoji

        if(/😂|🤣|😅|😀|😛/.test(text))
            return {
                primary: TYPES.SOCIAL,
                confidence: 0.80
            };

        return {

            primary: TYPES.UNKNOWN,

            confidence: 0.30

        };

    }

}

module.exports = MessageClassifier;
