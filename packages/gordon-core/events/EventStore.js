class EventStore {
    constructor(maxEvents = 1000) {
        this.events = [];
        this.maxEvents = maxEvents;
    }

    add(event) {
        this.events.push(event);
        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }
        return event;
    }

    all() {
        return this.events;
    }

    get(id) {
        return this.events.find(e => e.id === id);
    }

    findByKind(kind) {
        return this.events.filter(e => e.kind === kind);
    }

    findByActor(actor) {
        return this.events.filter(e => e.actor === actor);
    }

    latest(limit = 50) {
        return this.events.slice(-limit);
    }

    children(parentId) {
        return this.events.filter(e => e.parentId === parentId);
    }

    clear() {
        this.events = [];
    }
}

const instance = new EventStore();

// Attach static helper methods delegating to singleton instance
EventStore.instance = instance;
EventStore.add = (event) => instance.add(event);
EventStore.all = () => instance.all();
EventStore.get = (id) => instance.get(id);
EventStore.findByKind = (kind) => instance.findByKind(kind);
EventStore.findByActor = (actor) => instance.findByActor(actor);
EventStore.latest = (limit) => instance.latest(limit);
EventStore.children = (parentId) => instance.children(parentId);
EventStore.clear = () => instance.clear();

module.exports = EventStore;
