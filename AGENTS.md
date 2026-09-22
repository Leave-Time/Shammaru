# Repository Guidelines

## Project Structure & Module Organization

Shammaru is a Wails v2 desktop application. Go application code and the Wails entrypoint are in the repository root (`app.go`, `main.go`). The React + TypeScript frontend is in `frontend/`: edit UI code in `frontend/src/`, Vite settings in `frontend/vite.config.ts`, and frontend dependencies in `frontend/package.json`. Wails platform metadata and icons live in `build/darwin/` and `build/windows/`. `frontend/dist/` and `build/bin/` are generated outputs and should not be edited or committed.

## Build, Test, and Development Commands

- `wails dev` starts the Wails development app with Vite hot reload.
- `wails build` compiles the frontend and packages a distributable application.
- `cd frontend && pnpm install` installs JavaScript dependencies after checkout or lockfile changes.
- `cd frontend && pnpm run build` runs TypeScript checking and creates the Vite production bundle.
- `go test ./...` runs all Go tests (the repository currently has no test files, but new Go behavior should add them).

Use Go 1.25, Node.js/npm, and the Wails CLI compatible with `github.com/wailsapp/wails/v2`.

## Coding Style & Naming Conventions

Run `gofmt` on every changed Go file; use idiomatic Go names and keep exported APIs documented. TypeScript is strict (`frontend/tsconfig.json`), so prefer explicit types over `any` and use PascalCase for React components, camelCase for functions/variables, and descriptive CSS class names. Match the existing frontend style (four-space indentation, semicolons where already used) and keep component styles in the relevant CSS file.

## Testing Guidelines

Place Go tests beside their implementation in `*_test.go` files and run `go test ./...`. Frontend changes must at least pass `npm run build`; add a project-appropriate frontend test runner before introducing frontend tests, using `*.test.ts` or `*.test.tsx` naming.

## Commit & Pull Request Guidelines

All commits must follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/zh-hans/v1.0.0/):

```text
<type>(<scope>): <imperative description>
```

Use a lowercase type and a concise imperative subject. The scope is optional, but should identify the affected module when useful. Keep unrelated changes in separate commits.

Allowed types for this repository include:

- `feat`: add user-visible functionality.
- `fix`: correct a bug or regression.
- `refactor`: change structure without changing behavior.
- `docs`: update documentation only.
- `test`: add or update tests.
- `build`: change build, packaging, or toolchain configuration.
- `chore`: maintenance or repository setup work.

Examples:

```text
feat(project): add problem layout initialization
fix(judge): preserve compiler environment
docs(format): document project manifest
chore(init): initialize Shammaru desktop application
```

Pull requests should explain the user-visible or architectural change, list validation commands run, link relevant issues, and include screenshots or a short recording for UI changes. Call out platform-specific build effects and any generated files intentionally changed.

## Security & Configuration Tips

Do not commit secrets, local credentials, or machine-specific paths. Review `wails.json` and platform files when changing packaging metadata, and keep generated dependency lockfiles synchronized with intentional dependency changes.
