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

            description: options.description || "",

            ...options

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

    has(name) {

        return this.services.has(name);

    }

    isOnline(name) {

        const service = this.services.get(name);

        return !!service && service.status === "ONLINE";

    }

    list() {

        return [...this.services.values()];

    }

}

module.exports = new ServiceRegistry();
