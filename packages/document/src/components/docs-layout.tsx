import * as React from 'react';
import Link from 'next/link';
import { Footer } from './footer';

const TableItem: React.FC<{
  href: string;
  children?: React.ReactNode;
}> = ({ children, href }) => (
  <Link href={href} legacyBehavior>
    <a className="relative block rounded px-3 py-1.5 text-tutorial-700 transition-colors duration-200 hover:text-tutorial-500">
      {children}
    </a>
  </Link>
);

const TableHeader: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => (
  <span className="mb-1 mt-3 px-3 text-sm font-semibold uppercase tracking-wide text-tutorial-900">{children}</span>
);

export default function DocsLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white bg-opacity-50">
      <div className="mx-auto w-full max-w-4xl flex-1 px-2">
        <header className=" col-start-1 col-end-6 mb-16 mt-12 flex items-center justify-between px-2">
          <Link href="/">React Tutorial Overlay</Link>
          <a className="flex text-tutorial-600 underline" href="https://github.com/sjsjsj1246/react-turotial-overlay">
            GitHub
          </a>
        </header>

        <div className="md:flex md:space-x-4">
          <nav className="rounded-lg font-medium ">
            <div className="sticky top-0 mb-8 flex flex-col">
              <TableHeader>Overview</TableHeader>
              <TableItem href="/docs">Get Started</TableItem>

              <TableHeader>API</TableHeader>
              <TableItem href="/docs/tutorial">tutorial()</TableItem>
              <TableItem href="/docs/tutorial-overlay">TutorialOverlay</TableItem>

              <TableHeader>Guides</TableHeader>
              <TableItem href="/docs/styling">Styling</TableItem>
              <TableItem href="/docs/customizing">Customizing</TableItem>

              <TableHeader>Releases</TableHeader>
              <TableItem href="/docs/version-1">Version 1</TableItem>
            </div>
          </nav>

          <main className="prose-tutorial prose col-span-4 w-full flex-1 text-tutorial-900">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
