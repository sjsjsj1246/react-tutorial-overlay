# Releasing

This repository now uses [Changesets](https://github.com/changesets/changesets) for versioning, changelog generation, and npm publishing.

## One-time setup

This repository uses npm Trusted Publishing for GitHub Actions.

Set up once on npm:

1. Open the `react-tutorial-overlay` package settings on npm.
2. Add a Trusted Publisher for the `sjsjsj1246/react-tutorial-overlay` GitHub repository.
3. Set the workflow filename to `release.yml`.

After that, the GitHub release workflow can publish without storing a long-lived `NPM_TOKEN` secret.

## Everyday workflow

1. Make your code change on a feature branch.
2. Add a changeset before opening or updating the PR.
3. Merge the PR into `main`.
4. Let the Release workflow open or update the version PR.
5. Merge the version PR to update `CHANGELOG.md` and package versions on `main`.
6. Run the `Publish` workflow manually when you want to ship that version to npm.

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

On pushes to `main`, `.github/workflows/release.yml` runs `changesets/action`.

- If unreleased changesets exist, it opens or updates a release PR.
- It does not publish to npm.

## What the publish workflow does

Run `.github/workflows/publish.yml` manually when you want to ship the current version on `main`.

- `pnpm release` verifies tests, docs lint/build, size limits, and then runs `changeset publish`.
- Publishing uses GitHub Actions OIDC via npm Trusted Publishing instead of an `NPM_TOKEN` secret.

## Notes for this repo

- Only the root `react-tutorial-overlay` package is versioned and published.
- `packages/document` and `packages/main` are ignored by Changesets.
- `CHANGELOG.md` is updated by `changeset version` through the release PR flow.
