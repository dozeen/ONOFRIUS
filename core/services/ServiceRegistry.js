class ServiceRegistry {

    constructor() {

        this.services = new Map();

    }

    register(name, options = {}) {

        this.services.set(name, {
            name,
            status: options.status || "ONLINE",
            version: options.version || "1.0",
            optional: options.optional || false,
            description: options.description || ""
        });

    }

    setStatus(name, status) {

        const service = this.services.get(name);

        if (service) {

            service.status = status;

        }

    }

    get(name) {

        return this.services.get(name);

    }

    list() {

        return [...this.services.values()];

    }

}

module.exports = new ServiceRegistry();
