# Releasing

This repository now uses [Changesets](https://github.com/changesets/changesets) for versioning, changelog generation, and npm publishing.

## One-time setup

The GitHub release workflow expects an `NPM_TOKEN` repository secret with publish access to the `react-tutorial-overlay` npm package.

## Everyday workflow

1. Make your code change on a feature branch.
2. Add a changeset before opening or updating the PR.
3. Merge the PR into `main`.
4. Let the Release workflow open or update the version PR.
5. Merge the version PR to publish the new npm version and update `CHANGELOG.md`.

## Adding a changeset

Run:

```bash
pnpm changeset
```

When prompted:

- Select `react-tutorial-overlay`
- Pick the appropriate bump type (`patch`, `minor`, or `major`)
- Write a short, user-facing summary

This creates a markdown file in `.changeset/`. Commit that file with the feature change.

## Useful commands

Create a changeset:

```bash
pnpm changeset
```

Preview versioning locally:

```bash
pnpm version-packages
```

Run the full release verification locally:

```bash
pnpm release:verify
```

Publish locally if you really need to:

```bash
pnpm release
```

The normal path should be the GitHub Release workflow instead of local publishing.

## What the release workflow does

On pushes to `main` or manual dispatch, `.github/workflows/release.yml` runs `changesets/action`.

- If unreleased changesets exist, it opens or updates a release PR.
- If the release PR has already been merged and version files are on `main`, it runs `pnpm release`.
- `pnpm release` verifies tests, docs lint/build, size limits, and then runs `changeset publish`.

## Notes for this repo

- Only the root `react-tutorial-overlay` package is versioned and published.
- `packages/document` and `packages/main` are ignored by Changesets.
- `CHANGELOG.md` is updated by `changeset version` through the release PR flow.
