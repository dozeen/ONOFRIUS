/**
 * SocialGraphEngine.js - Traccia chi parla, chi risponde a chi ed la Risonanza dei contatti
 */

class SocialGraphEngine {
    constructor() {
        this.graph = {}; // { person: { speaks: count, repliesTo: { target: count }, resonanceScore: number, lastSeen: timestamp } }
    }

    recordInteraction(sender, recipient, isReply = false) {
        if (!sender) return;

        const now = Date.now();
        if (!this.graph[sender]) {
            this.graph[sender] = { speaks: 0, repliesTo: {}, resonanceScore: 0, lastSeen: now };
        }

        this.graph[sender].speaks += 1;
        this.graph[sender].lastSeen = now;

        if (recipient && recipient !== sender) {
            if (isReply) {
                this.graph[sender].repliesTo[recipient] = (this.graph[sender].repliesTo[recipient] || 0) + 1;
                // Incrementa la risonanza del destinatario (riceve risposte!)
                if (!this.graph[recipient]) {
                    this.graph[recipient] = { speaks: 0, repliesTo: {}, resonanceScore: 0, lastSeen: now };
                }
                this.graph[recipient].resonanceScore += 1;
            }
        }
    }

    getResonance(person) {
        return this.graph[person] ? this.graph[person].resonanceScore : 0;
    }

    getInactiveContacts(daysThreshold = 7) {
        const now = Date.now();
        const inactive = [];

        for (const [person, data] of Object.entries(this.graph)) {
            const diffDays = Math.floor((now - data.lastSeen) / (24 * 60 * 60 * 1000));
            if (diffDays >= daysThreshold) {
                inactive.push({ person, inactiveDays: diffDays, resonanceScore: data.resonanceScore });
            }
        }

        return inactive;
    }
}

module.exports = new SocialGraphEngine();
