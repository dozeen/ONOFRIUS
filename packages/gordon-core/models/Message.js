class Message {

    constructor(data = {}) {

// ----- COGNITIVE STATE -----

this.classification = null;

this.perception = null;

this.knowledge = [];

this.events = [];

this.tasks = [];

this.permissions = [];

this.context = {};

this.debug = [];
        // Identità

        this.id = data.id || null;

        this.chatId = data.chatId || null;

        this.timestamp = data.timestamp || Date.now();

        this.role = data.role || "user";

        this.text = data.text || "";

        // Provenienza

        this.source = data.source || null;

        // Contatto

        this.contact = data.contact || null;

        // Piano del Planner

        this.plan = data.plan || null;

        // Memorie

        this.history = data.history || [];

        this.memory = data.memory || null;

        // Analisi

        this.analysis = data.analysis || null;

        this.style = data.style || null;

        this.intent = data.intent || null;

        this.emotion = data.emotion || null;

        // NLP

        this.entities = data.entities || [];

        this.keywords = data.keywords || [];

        // Embedding

        this.embedding = data.embedding || null;

        // Risposta

        this.response = data.response || null;

        // Extra

        this.metadata = data.metadata || {};

    }

}

module.exports = Message;
