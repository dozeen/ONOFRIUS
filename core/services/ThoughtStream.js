class ThoughtStream {

    constructor() {
        this.innerWorld = {
            thoughts: [],
            intentions: []
        };
    }

    addThought(thought) {
        this.innerWorld.thoughts.push(thought);
    }

    addIntention(intention) {
        this.innerWorld.intentions.push(intention);
    }

    getInnerWorld() {
        return this.innerWorld;
    }

    clear() {
        this.innerWorld = {
            thoughts: [],
            intentions: []
        };
    }
}

module.exports = ThoughtStream;
