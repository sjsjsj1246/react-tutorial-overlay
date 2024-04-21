import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="container relative mx-auto my-8 flex flex-col items-center justify-center space-y-4">
      <div className="flex space-x-4">
        <a className="underline" href="https://github.com/sjsjsj1246/react-tutorial-overlay">
          GitHub
        </a>
        <Link href="/docs" legacyBehavior>
          <a id="docs-link" className="underline">
            Docs
          </a>
        </Link>
      </div>
      <div className="text-tutorial-600">
        <span>© {new Date().getFullYear()} react-tutorial-overlay</span>
        {' · '}
        <span>
          <span>Built by </span>
          <a className="underline" href="https://github.com/sjsjsj1246">
            sjsjsj1246
          </a>
        </span>
      </div>
    </footer>
  );
}
