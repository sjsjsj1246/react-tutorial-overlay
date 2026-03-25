'react-tutorial-overlay': minor
---

Add explicit progress control APIs for active tutorials.

- Added `startAt` to `tutorial.open()` so callers can choose the initial step without mutating internal state.
- Added `tutorial.goTo(index)` for imperative step navigation with clamped index handling.
- Added `tutorial.getState()` to expose a small read-only progress snapshot for external controls.
- Documented the new progress control contract and added regression tests for Promise API compatibility.
