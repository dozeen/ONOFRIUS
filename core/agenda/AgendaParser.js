const AIAgendaParser = require("./AIAgendaParser");

class AgendaParser {

    static async parse(message) {

        const parser = new AIAgendaParser();

        const event = await parser.parse(message);

        console.log("");
        console.log("========== EVENT PARSER ==========");
        console.dir(event, { depth: null });
        console.log("=================================");
        console.log("");

        return event;
    }

}

module.exports = AgendaParser;
