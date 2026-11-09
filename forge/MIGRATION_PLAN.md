# ONOFRIUS MIGRATION PLAN - ALPHA 0.5 (IDENTITY ABSTRACTION)

Replace project-specific identities with generic owner abstraction.

## CHARACTER

[x] Replace specific character profiles with generic profile/default.js
[x] Abstract character engine configuration

## OWNER

[x] Provide owner.example.json schema template
[x] Add first-run interactive owner setup

## CONFIG & CONTACTS

[x] Untrack personal config/owner.json, config/contacts.json, config/settings.json
[x] Provide contacts.example.json, settings.example.json, identities.example.json

## PRIVACY & PRIVILEGES

[x] Replace hardcoded identity subjects with role-based PrivacyManager (PRIMARY_FAMILY, CONFIDENTIAL_SUBJECT)
[x] Remove static person regexes from FactExtractor & FactVerifier

## AUDIT

[x] Zero hardcoded personal names in repository tracking
[x] Privacy Audit = PASS
