#!/usr/bin/env node

const bootstrap = require("../bootstrap");

bootstrap().catch(err => {
  console.error('[ONOFRIUS] Bootstrap failed:', err);
  process.exit(1);
});
