class Debug {

    constructor() {
        this.enabled = false;
    }

    on() {
        this.enabled = true;
    }

    off() {
        this.enabled = false;
    }

    toggle() {
        this.enabled = !this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }

    log(...args) {
        if (this.enabled) {
            console.log(...args);
        }
    }

}

module.exports = new Debug();
