class Fact {

    constructor(type, key, value, source = "user") {

        this.type = type;

        this.key = key;

        this.value = value;

        this.source = source;

        this.timestamp = new Date().toISOString();

    }

}

module.exports = Fact;
