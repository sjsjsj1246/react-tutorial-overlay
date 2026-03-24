<div align="center"><a name="readme-top"></a>

<h1>React Tutorial Overlay</h1>

A React library for step-by-step product tutorials with an imperative overlay API.

(This is an open source library that is still under development.)

</div>

## Features

- ✨ step-by-step tutorial overlay
- 🎯 highlight one or more DOM targets per step
- 🕹 imperative controls via `tutorial.open()`, `next()`, `prev()`, and `close()`
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
  const handleClick = () => {
    tutorial.open({
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
        infoBoxHeight: 220,
        infoBoxMargin: 24,
        onClose: () => {
          console.log('tutorial closed');
        },
      },
    });
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

`content` is rendered as a plain string. HTML markup in the string is not interpreted.

Mount `<TutorialOverlay />` once near the root of your app, then trigger `tutorial.open({ steps, options })` from any event handler or effect.

## Documentation

- [Docs](https://react-tutorial-overlay.vercel.app/docs)

## Contributing

[@sjsjsj1246](https://github.com/sjsjsj1246)
