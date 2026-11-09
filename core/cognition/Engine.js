class Engine {

    constructor(name, priority = 100) {

        this.name = name;
        this.priority = priority;

    }

    async process(context) {

        return context;

    }

}

module.exports = Engine;
