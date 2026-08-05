# GORDON3
## Architecture Document

Version: 1.0 (Draft)

---

# Cos'è Gordon3

Gordon3 non è un chatbot.

Gordon3 è un sistema cognitivo modulare progettato per:

- percepire il mondo esterno;
- comprendere il contesto;
- mantenere memoria a breve e lungo termine;
- ragionare;
- pianificare;
- imparare;
- agire.

WhatsApp è soltanto uno dei possibili canali di comunicazione.

L'obiettivo è costruire un motore cognitivo indipendente dalla piattaforma.

---

# Filosofia

Ogni modulo deve avere una sola responsabilità.

Il sistema deve poter crescere senza modificare il cuore del progetto.

Ogni nuova funzionalità deve poter essere aggiunta tramite plugin oppure nuovi moduli, evitando dipendenze circolari.

Il codice deve essere leggibile prima ancora che efficiente.

---

# Principi fondamentali

1. Single Responsibility

Ogni modulo fa una sola cosa.

2. Loose Coupling

I moduli comunicano tramite Event Bus.

Mai tramite dipendenze dirette quando evitabile.

3. High Cohesion

Le funzioni simili vivono nello stesso modulo.

4. Event Driven

Il sistema reagisce agli eventi.

Non esiste un modulo "onnisciente".

5. Adapter Independence

Il Brain non deve sapere se il messaggio proviene da:

- WhatsApp
- Telegram
- Discord
- REST API
- Console
- Voce

---

# Architettura generale

                    INPUT

                       │

        WhatsApp Telegram Discord REST

                       │

                       ▼

                 ADAPTER LAYER

                       │

                       ▼

                  PERCEPTION

                       │

                       ▼

                  EVENT BUS

                       │

                       ▼

                     KERNEL

                       │

                       ▼

                     BRAIN

                       │

                       ▼

                   PLANNER

                       │

                       ▼

                   ACTIONS

                       │

                       ▼

                    OUTPUT

---

# Componenti

## Adapters

Responsabilità

Tradurre il protocollo esterno in Stimulus.

Gli adapter NON prendono decisioni.

Gli adapter NON ragionano.

Gli adapter NON conoscono il Brain.

Input:

messaggi esterni.

Output:

Stimulus.

---

## Perception

Responsabilità

Analizzare ciò che arriva.

Costruire un Context.

Attività:

- media
- contatto
- gruppo
- emozione preliminare
- entità
- metadati

Output

Context

---

## Event Bus

Responsabilità

Disaccoppiare completamente il sistema.

Qualunque modulo può emettere eventi.

Qualunque modulo può ascoltare eventi.

---

## Kernel

Il Kernel coordina il sistema.

Non contiene logica cognitiva.

Decide semplicemente quale pipeline eseguire.

---

## Brain

Il Brain rappresenta il ragionamento.

Utilizza:

- memoria
- relazioni
- obiettivi
- prompt
- conoscenza

Produce una Decision.

---

## Planner

Trasforma una Decision in un piano operativo.

Esempi

- rispondere
- ignorare
- ricordare
- chiedere chiarimenti
- eseguire plugin

---

## Actions

Eseguono il piano.

Possono:

- inviare messaggi
- salvare dati
- richiamare plugin
- usare shell
- generare documenti

---

## Memory

La memoria è divisa in:

Short Term

Memoria della conversazione corrente.

Long Term

Conoscenza persistente.

Semantic Memory

Informazioni generali.

Relationship Memory

Rapporto con le persone.

---

## Learning

Il sistema osserva.

Non modifica immediatamente il proprio comportamento.

Le modifiche passano sempre da un processo di validazione.

---

## Plugins

I plugin estendono Gordon.

Non modificano il Core.

Ogni plugin dichiara:

- nome
- versione
- priorità
- eventi gestiti

---

# Pipeline Cognitiva

Stimulus

↓

Perception

↓

Context

↓

Kernel

↓

Brain

↓

Decision

↓

Planner

↓

Actions

↓

Learning

↓

Memory

---

# Struttura del progetto

config/
    configurazione

core/
    motore cognitivo

adapters/
    connessioni esterne

plugins/
    estensioni

docs/
    documentazione

data/
    dati persistenti

tests/
    test automatici

---

# Regole di sviluppo

Nessun modulo può superare una responsabilità.

Ogni cartella deve avere uno scopo preciso.

Ogni nuova feature deve essere documentata.

Il codice segue sempre l'architettura.

Mai il contrario.

---

# Visione

L'obiettivo finale di Gordon3 è diventare un sistema cognitivo modulare capace di percepire, comprendere, ricordare, ragionare e agire attraverso qualsiasi canale di comunicazione mantenendo un'architettura semplice, estendibile e indipendente dalla piattaforma.
