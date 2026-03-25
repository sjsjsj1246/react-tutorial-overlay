# Changelog

## 0.2.0

### Minor Changes

- 64e735b: Add explicit progress control APIs for active tutorials.

  - Added `startAt` to `tutorial.open()` so callers can choose the initial step without mutating internal state.
  - Added `tutorial.goTo(index)` for imperative step navigation with clamped index handling.
  - Added `tutorial.getState()` to expose a small read-only progress snapshot for external controls.
  - Documented the new progress control contract and added regression tests for Promise API compatibility.

- 8a6e45b: Improve the tutorial overlay with a more complete onboarding API and release workflow.

  - Added keyboard navigation, backdrop close controls, and a Promise-based `tutorial.open()` result for easier flow control.
  - Improved highlight padding, overlay positioning, accessibility, and built-in UI customization options.
  - Stabilized runtime behavior, restored test coverage, fixed docs lint/build issues, and aligned README/docs with the current API.
  - Added Changesets-based versioning and release automation so changelog updates and npm publishing are easier to manage.

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.1.0 (2024-04-21)

### Features

- build documentation site ([b58439a](https://github.com/sjsjsj1246/react-tutorial-overlay/commit/b58439a6e0dc5201f354a44f112be99948cd8f2c))
- tutorial-overlay basic ([0c28916](https://github.com/sjsjsj1246/react-tutorial-overlay/commit/0c28916bfc28c858759f68874c11aa56f9081035))
