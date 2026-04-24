# Git Flow Workflow (Team Guide)

This document explains how our team should use **git-flow commands** in this project.
Use the same workflow for both repositories:
- `frontend`
- `Business-Analytics-Backend`

---

## 1) First-Time Setup (Each Machine)

### Install git-flow

macOS (Homebrew):
```bash
brew install git-flow-avh
```

Check:
```bash
git flow version
```

### Initialize git-flow in repo
Run inside each repo root:
```bash
git flow init
```

Use these defaults:
- Production branch: `main`
- Development branch: `develop`
- Feature prefix: `feature/`
- Release prefix: `release/`
- Hotfix prefix: `hotfix/`

If backend does not have `develop` yet, create it first:
```bash
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

---

## 2) Most Important Rule (Avoid Conflicts)

Before starting any feature and before finishing any feature, always update local branches:

```bash
git checkout develop
git pull origin develop
```

Do this every day before coding.

---

## 3) Feature Workflow (Main Team Flow)

### A) Start feature

```bash
git checkout develop
git pull origin develop
git flow feature start <feature-name>
```

Example:
```bash
git flow feature start sale-record-crud
```

---

### B) Work and commit

```bash
git add .
git commit -m "feat(scope): short message"
```

---

### C) Publish feature (push to remote)

```bash
git flow feature publish <feature-name>
```

Example:
```bash
git flow feature publish sale-record-crud
```

This creates remote branch:
- `feature/sale-record-crud`

Then open Pull Request to:
- base: `develop`

---

### D) Track teammate feature branch

If your teammate already published a feature:

```bash
git flow feature track <feature-name>
```

Example:
```bash
git flow feature track sale-record-crud
```

---

### E) Finish feature

When PR is approved / feature is ready to merge:

```bash
git checkout develop
git pull origin develop
git flow feature finish <feature-name>
```

Example:
```bash
git flow feature finish sale-record-crud
```

After finishing, push updated `develop`:

```bash
git push origin develop
```

> Important: If your team merges through GitHub PR, do not force local finish in a conflicting state. Always `git pull origin develop` first.

---

## 4) Daily Sync Rules (Team)

### Start of day
```bash
git checkout develop
git pull origin develop
```

### Before pushing your feature
```bash
git checkout develop
git pull origin develop
git checkout feature/<your-feature>
git merge develop
```
Resolve conflicts, commit, then publish/push.

### Before opening PR
- Re-run tests/lint
- Ensure branch is up-to-date with `develop`

---

## 5) Release Workflow (When Needed)

Start release:
```bash
git checkout develop
git pull origin develop
git flow release start <version>
```

Finish release:
```bash
git pull origin develop
git pull origin main
git flow release finish <version>
```

Push all:
```bash
git push origin main
git push origin develop
git push --tags
```

---

## 6) Hotfix Workflow (Urgent Production Fix)

Start hotfix:
```bash
git checkout main
git pull origin main
git flow hotfix start <hotfix-name>
```

Finish hotfix:
```bash
git pull origin main
git pull origin develop
git flow hotfix finish <hotfix-name>
```

Push all:
```bash
git push origin main
git push origin develop
git push --tags
```

---

## 7) Commit Message Style

Use:
```txt
type(scope): message
```

Examples:
- `feat(sale-record): add create/edit/delete modal`
- `fix(auth): handle expired token`
- `refactor(product): split table and filters`
- `docs(gitflow): add team workflow`

---

## 8) Quick Command Cheat Sheet

```bash
# update local develop
git checkout develop && git pull origin develop

# start feature
git flow feature start <feature-name>

# publish feature
git flow feature publish <feature-name>

# track teammate feature
git flow feature track <feature-name>

# finish feature
git checkout develop && git pull origin develop
git flow feature finish <feature-name>
git push origin develop
```

---

## 9) Team Policy

- Never code directly on `main`.
- Always start from updated `develop` (`git pull origin develop`).
- Use `git flow feature ...` for all normal feature work.
- Keep PR small and clear.
- Pull before finish to minimize conflicts.
