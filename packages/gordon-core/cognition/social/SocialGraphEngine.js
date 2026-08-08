/**
 * SocialGraphEngine.js - Traccia le interazioni tra persone ed i periodi di inattività (Social Graph)
 */

class SocialGraphEngine {
    constructor() {
        this.graph = {}; // { person: { interactsWith: { target: count }, lastSeen: timestamp } }
    }

    recordInteraction(sender, recipient, text) {
        if (!sender) return;

        const now = Date.now();
        if (!this.graph[sender]) {
            this.graph[sender] = { interactsWith: {}, lastSeen: now };
        }

        this.graph[sender].lastSeen = now;

        if (recipient && recipient !== sender) {
            this.graph[sender].interactsWith[recipient] = (this.graph[sender].interactsWith[recipient] || 0) + 1;
        }
    }

    getInactiveContacts(daysThreshold = 7) {
        const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const inactive = [];

        for (const [person, data] of Object.entries(this.graph)) {
            const diffDays = Math.floor((now - data.lastSeen) / (24 * 60 * 60 * 1000));
            if (diffDays >= daysThreshold) {
                inactive.push({ person, inactiveDays: diffDays });
            }
        }

        return inactive;
    }
}

module.exports = new SocialGraphEngine();
