<div align="center"><a name="readme-top"></a>

<h1>React Tutorial Overlay</h1>

A headless library that makes it easy to put tutorials on top of the screen.

(This is an open source library that is still under development.)

</div>

## Features

- ✨ step-by-step tutorial overlay
- 🎨 easily customizable
- 🤝 Pomise API (Coming Soon)
- 🚀 Lightweight (Coming Soon)
- 👻 Headless (Coming Soon)

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
import { TutorialOverlay, tutorial } from "../src";

const App = () => {
  const handleClick = () => {
    tutorial.open([
      {
        targetIds: ["target1"],
        title: "title",
        content: "content",
      },
    ]);
  };

  return (
    <div>
      <button onClick={handleClick}>open</button>
      <TutorialOverlay />
    </div>
  );
};
```

## Documentation

- [Document](https://react-tutorial-overlay.vercel.app/docs)

## Contributing

@sjsjsj1246
