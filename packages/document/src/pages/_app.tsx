import '@/styles/globals.css';
import { MDXComponents } from 'mdx/types';
import type { AppProps } from 'next/app';
import { MDXProvider } from '@mdx-js/react';
import Link from 'next/link';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { Code } from '@/components/code';
import { TutorialOverlay } from 'react-tutorial-overlay';

const components: MDXComponents = {
  a: (props) => (
    <Link href={props.href ?? ''} legacyBehavior>
      <a {...props} />
    </Link>
  ),
  code: (props) =>
    props.className ? (
      <Code className={props.className} snippet={props.children as string} />
    ) : (
      <code className="my-0.5 rounded bg-tutorial-300 bg-opacity-40 px-1 py-1" {...props} />
    ),
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <MDXProvider components={components}>
        <Component {...pageProps} />
        <Analytics />
      </MDXProvider>
      <TutorialOverlay />
    </>
  );
}
