class CapabilityRegistry {

    constructor() {

        this.engines = new Map();

    }

    register(name, engine) {

        this.engines.set(name, engine);

    }

    get(name) {

        return this.engines.get(name);

    }

}

module.exports = new CapabilityRegistry();
