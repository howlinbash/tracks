#!/bin/sh

tsc ./scripts/load-db.ts
chmod +x ./scripts/load-db.js
node ./scripts/load-db.js
