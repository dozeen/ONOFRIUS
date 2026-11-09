class CapabilityRegistry {

    constructor() {

        this.capabilities = new Map();

    }

    register(name, status, optional = false) {

        this.capabilities.set(name, {
            status,
            optional
        });

    }

    get(name) {

        return this.capabilities.get(name);

    }

    all() {

        return [...this.capabilities.entries()];

    }

}

module.exports = new CapabilityRegistry();
