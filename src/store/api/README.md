# API Store Structure

This folder follows a feature-first RTK Query structure.

## Layout

- `core.ts`: shared `createApi`, base URL config, and 401 refresh retry logic.
- `modules/*.ts`: one file per feature endpoint group (auth, sales, settings, etc.).
- `contracts/*.ts`: one file per feature type contract.
- `types.ts`: compatibility barrel that re-exports all contracts.
- `index.ts`: public API barrel (exports `api` + all hooks + all types).
- `utils.ts`: shared response normalizers and auth mapping helpers.

## Rules

1. Add new endpoints only inside a feature module under `modules/`.
2. Add feature request/response types in matching `contracts/<feature>.ts`.
3. Export the new module hooks from `index.ts`.
4. Keep `core.ts` free from feature-specific logic.
5. Keep refresh-token behavior centralized in `core.ts`.
