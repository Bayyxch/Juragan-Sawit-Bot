# Validation

Checked before packaging:

- Relative imports in `src/` resolve to existing files.
- TypeScript structural audit passes with temporary local stubs for external packages.
- Land expansion formula sanity check passes.
- Random yield range sanity check passes.
- Initial SQLite migration schema executes successfully against SQLite in-memory.
- `.env`, local database, build output, and dependencies are excluded from Git/package archives where applicable.

A full `npm install` / real dependency build was not possible in the execution runner because the package installation step timed out. The project is therefore packaged without `node_modules` or a generated lockfile. On the target machine, run `npm install`, then `npm run ci`.
