/**
 * thoughts.js - Formattatore della sezione THOUGHTS per Prompt Builder 2.1
 * Include FamilyPrivacyManager e RelevanceFilter per la pertinenza contestuale.
 */

const ThoughtStream = require("../../memory/thoughts/ThoughtStream");
const FamilyPrivacyManager = require("../privacy/FamilyPrivacyManager");
const RelevanceFilter = require("../cognition/RelevanceFilter");

module.exports = function buildThoughtsPrompt(context) {
    if (!context) return "";

    let innerWorld = { thoughts: [], intentions: [], goals: [], preferences: [] };

    try {
        const thoughtStream = context.thoughtStream || new ThoughtStream();
        innerWorld = thoughtStream.getInnerWorld();
    } catch (err) {
        // Fallback
    }

    const contextThoughts = (context.facts && context.facts.thoughts) || [];
    const contextPreferences = (context.facts && context.facts.preferences) || [];

    let thoughts = [
        ...(innerWorld.thoughts || []).map(t => t.content),
        ...contextThoughts.map(t => t.content)
    ];

    let intentions = [
        ...(innerWorld.intentions || []).map(i => i.content)
    ];

    let goals = [
        ...(innerWorld.goals || []).map(g => g.content || g)
    ];

    let preferences = [
        ...(innerWorld.preferences || []).map(p => p.content),
        ...contextPreferences.map(p => p.content)
    ];

    // 1. Privacy Filter tramite FamilyPrivacyManager basato sul destinatario della chat
    const recipientName = (context.contactName || context.senderName || context.chat?.name || "");

    thoughts = FamilyPrivacyManager.filterAllowed(thoughts, recipientName);
    intentions = FamilyPrivacyManager.filterAllowed(intentions, recipientName);
    goals = FamilyPrivacyManager.filterAllowed(goals, recipientName);
    preferences = FamilyPrivacyManager.filterAllowed(preferences, recipientName);

    // 2. Filtro di Pertinenza Contestuale (Relevance Filter)
    const inputText = context.text || context.message || "";
    intentions = RelevanceFilter.filterRelevantThoughts(intentions, inputText);
    thoughts = RelevanceFilter.filterRelevantThoughts(thoughts, inputText);

    const uniqueThoughts = [...new Set(thoughts.filter(Boolean))];
    const uniqueIntentions = [...new Set(intentions.filter(Boolean))];
    const uniqueGoals = [...new Set(goals.filter(Boolean))];
    const uniquePreferences = [...new Set(preferences.filter(Boolean))];

    if (uniqueThoughts.length === 0 && uniqueIntentions.length === 0 && uniqueGoals.length === 0 && uniquePreferences.length === 0) {
        return "";
    }

    let output = "==================\nTHOUGHTS\n==================\n";

    if (uniqueThoughts.length > 0) {
        output += `• OBSERVATIONS: ${uniqueThoughts.map(t => `"${t}"`).join(", ")}\n`;
    }
    if (uniqueIntentions.length > 0) {
        output += `• INTENTIONS: ${uniqueIntentions.map(i => `"${i}"`).join(", ")}\n`;
    }
    if (uniqueGoals.length > 0) {
        output += `• GOALS: ${uniqueGoals.map(g => `"${g}"`).join(", ")}\n`;
    }
    if (uniquePreferences.length > 0) {
        output += `• PREFERENCES: ${uniquePreferences.map(p => `"${p}"`).join(", ")}\n`;
    }

    return output.trim();
};
