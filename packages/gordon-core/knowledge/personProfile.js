class PersonProfile {

    constructor(name) {

        this.name = name;

        this.aliases = [];

        this.relationship = "";

        this.preferences = [];

        this.personality = {};

        this.facts = [];

        this.important_events = [];

        this.last_update = new Date().toISOString();

    }

}

module.exports = PersonProfile;
