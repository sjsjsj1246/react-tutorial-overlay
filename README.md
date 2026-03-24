<div align="center"><a name="readme-top"></a>

<h1>React Tutorial Overlay</h1>

A React library for step-by-step product tutorials with an imperative overlay API.

(This is an open source library that is still under development.)

</div>

## Features

- ✨ step-by-step tutorial overlay
- 🎯 highlight one or more DOM targets per step
- 🕹 imperative controls via `tutorial.open()`, `next()`, `prev()`, and `close()`
- ⏳ await tutorial completion with a small Promise result payload
- 📦 minimal setup with a single `<TutorialOverlay />` mount

## Get Started

**install with npm**

```bash
npm install react-tutorial-overlay
```

**install with yarn**

```bash
yarn add react-tutorial-overlay
```

```jsx
import { TutorialOverlay, tutorial } from 'react-tutorial-overlay';

const App = () => {
  const handleClick = async () => {
    const result = await tutorial.open({
      steps: [
        {
          targetIds: ['target1'],
          title: 'Welcome',
          content: 'Click next to move through the tutorial.',
        },
        {
          targetIds: ['target2'],
          title: 'Second step',
          content: 'Each step can highlight one or more element ids.',
          infoBoxAlignment: 'right',
        },
      ],
      options: {
        highLightPadding: 12,
        infoBoxHeight: 220,
        infoBoxWidth: '24rem',
        infoBoxMargin: 24,
        overlayColor: 'rgba(15, 23, 42, 0.6)',
        highlightBorderColor: '#22c55e',
        highlightBorderRadius: 16,
        zIndex: 3000,
        labels: {
          prev: 'Back',
          next: 'Continue',
          skip: 'Dismiss',
          done: 'Finish',
        },
        keyboardNavigation: true,
        closeOnOverlayClick: true,
        onClose: () => {
          console.log('tutorial closed');
        },
      },
    });

    if (result.reason === 'completed') {
      console.log('continue onboarding flow');
    }
  };

  return (
    <div>
      <button onClick={handleClick}>open</button>
      <div id="target1">target</div>
      <div id="target2">another target</div>
      <TutorialOverlay />
    </div>
  );
};
```

`tutorial.open()` returns `Promise<{ reason: 'completed' | 'skipped' | 'closed' }>`:

- `completed`: the user finished the last step.
- `skipped`: the user clicked the built-in `건너뛰기` button.
- `closed`: the tutorial was closed externally, such as `tutorial.close()`, `Escape`, backdrop click, or opening a new tutorial while another promise is still pending.

`content` is rendered as a plain string. HTML markup in the string is not interpreted.

`highLightPadding` expands the highlight frame around the target element. It defaults to `8` pixels and applies to the rendered highlight box as well as the info box anchor position.

Use `overlayColor`, `highlightBorderColor`, `highlightBorderRadius`, `zIndex`, and `infoBoxWidth` to match the built-in UI to your product without changing the overlay, highlight, or info box structure. When omitted, the existing defaults remain in place.

Use `labels` to override the built-in button text. The default labels are `이전`, `다음`, `건너뛰기`, and `완료`.

Keyboard navigation is enabled by default while the overlay is open:

- `Escape` closes the tutorial.
- `ArrowRight` moves to the next step and completes the tutorial on the last step.
- `ArrowLeft` moves to the previous step and is a no-op on the first step.

Set `options.keyboardNavigation` to `false` to disable those shortcuts. Shortcuts are ignored while an `input`, `textarea`, `select`, or `contenteditable` element has focus.

Set `options.closeOnOverlayClick` to `true` to close the tutorial when the dimmed backdrop itself is clicked. Clicks on the highlight frame and info box do not trigger close.

The info box automatically flips and clamps itself to stay inside the viewport when the target sits close to an edge.

For accessibility, the info box is exposed as a labeled `dialog`. When the tutorial opens, focus moves into the info box controls, and when it closes, focus returns to the element that was active before open. The library does not currently trap focus inside the overlay.

`options.onClose` still runs whenever the tutorial closes. Use the returned Promise when you need async flow control after the tutorial ends.

Mount `<TutorialOverlay />` once near the root of your app, then trigger `tutorial.open({ steps, options })` from any event handler or effect.

## Documentation

- [Docs](https://react-tutorial-overlay.vercel.app/docs)
- [Release Guide](./docs/releasing.md)

## Releasing

This repo uses Changesets for versioning and changelog generation.

```bash
pnpm changeset
```

Add a changeset in feature PRs when the published package should change. After merge to `main`, the Release workflow opens or updates a version PR. Merging that PR updates `CHANGELOG.md` and publishes the next npm version.

## Contributing

[@sjsjsj1246](https://github.com/sjsjsj1246)
