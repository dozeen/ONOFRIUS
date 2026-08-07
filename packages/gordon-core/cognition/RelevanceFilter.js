/**
 * RelevanceFilter.js - Selezionatore di Pertinenza Cognitiva per il Prompt Builder
 * 
 * Evita di contaminare i prompt con fatti o pensieri irrilevanti o del passato.
 * Seleziona solo le intenzioni e le preferenze pertinenti alle parole chiave dello stimolo.
 */

class RelevanceFilter {
    static INPUT = ["items", "inputText"];
    static OUTPUT = ["relevantItems"];

    /**
     * Filtra una lista di pensieri/intenzioni mantenendo solo quelli pertinenti al contesto corrente
     * @param {Array} items - Lista di pensieri/intenzioni
     * @param {string} inputText - Messaggio in ingresso
     * @returns {Array} Elementi pertinenti
     */
    static filterRelevantThoughts(items, inputText = "") {
        if (!items || !Array.isArray(items) || items.length === 0) return [];
        if (!inputText) return items.slice(0, 3);

        const lowerInput = inputText.toLowerCase();
        const keywords = lowerInput.split(/\s+/).filter(w => w.length > 3);

        const relevant = items.filter(item => {
            const itemText = (typeof item === "string" ? item : (item.content || "")).toLowerCase();
            return keywords.some(kw => itemText.includes(kw));
        });

        if (relevant.length === 0) {
            return items.slice(0, 2);
        }

        return relevant;
    }

    /**
     * Filtra le preferenze stabili (es. "Preferisco comunicare via email") includendole SOLO se pertinenti
     * @param {Array} items - Lista preferenze
     * @param {string} inputText - Messaggio in ingresso
     * @returns {Array} Preferenze pertinenti
     */
    static filterRelevantPreferences(items, inputText = "") {
        if (!items || !Array.isArray(items) || items.length === 0) return [];
        if (!inputText) return [];

        const lowerInput = inputText.toLowerCase();
        const keywords = lowerInput.split(/\s+/).filter(w => w.length > 2);
        const prefDomainKeywords = ["scriva", "scrivimi", "email", "mail", "comunicare", "contatto", "prefisco", "preferenza", "messaggio"];

        return items.filter(item => {
            const itemText = (typeof item === "string" ? item : (item.content || "")).toLowerCase();
            const hasDirectMatch = keywords.some(kw => itemText.includes(kw));
            const hasDomainMatch = prefDomainKeywords.some(kw => lowerInput.includes(kw));
            return hasDirectMatch || hasDomainMatch;
        });
    }
}

module.exports = RelevanceFilter;
