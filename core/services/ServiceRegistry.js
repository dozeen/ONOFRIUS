class ServiceRegistry {

    constructor() {

        this.services = new Map();

    }

    register(name, service) {

        this.services.set(name, service);

    }

    resolve(name) {

        return this.services.get(name) || null;

    }

    has(name) {

        return this.services.has(name);

    }

}

module.exports = new ServiceRegistry();
