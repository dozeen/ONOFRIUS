# Privacy release candidate

This candidate starts a new Git history. Operational configuration, chat sessions,
memories and private migration rules are not part of this release.
Numeric messaging fixtures and non-example email addresses were replaced with synthetic values.

Before publishing, run npm run audit:opensource with PRIVACY_SCANNER pointing to a trusted external scanner.
The audit fails closed when that scanner is unavailable. The Git pre-push hook also blocks publication
until the operator explicitly removes .git/PUBLISH_BLOCKED after reviewing the destination.
No remote is configured. Importing a private core requires PRIVATE_CORE_BUILDER and a new privacy audit.
This is a privacy review, not a guarantee that the application is free of security defects.
