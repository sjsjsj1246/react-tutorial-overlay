import { NextSeo } from 'next-seo';
import { Footer } from '@/components/footer';
import { tutorial } from 'react-tutorial-overlay';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    tutorial.open({
      steps: [
        {
          targetIds: ['button-open'],
          title: 'Welcome to the tutorial!',
          content: 'Start an overlay by calling tutorial.open({ steps, options }).',
        },
        {
          targetIds: ['button-docs'],
          title: 'Read the docs',
          content: 'Mount TutorialOverlay once, then drive the flow with the tutorial API.',
        },
      ],
    });
  };

  return (
    <main className="overflow-x-hidden">
      <NextSeo
        title={'react-tutorial-overlay'}
        description="A React library for step-by-step product tutorials with an imperative overlay API."
      />
      <div className="container prose mx-auto flex flex-col items-center justify-center">
        <h1 className="my-20">React Tutorial Overlay</h1>
        <p className="mb-8 text-center text-tutorial-700">
          Mount <code>{'<TutorialOverlay />'}</code> once and open guided flows with{' '}
          <code>{'tutorial.open({ steps, options })'}</code>.
        </p>
        <div className="flex gap-4">
          <button
            id="button-open"
            onClick={handleClick}
            className="rounded-md bg-tutorial-600 px-4 py-2 text-tutorial-50"
          >
            Start tutorial
          </button>
          <button
            id="button-docs"
            className="rounded-md bg-tutorial-600 px-4 py-2 text-tutorial-50"
            onClick={() => router.push('/docs')}
          >
            Documentation
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
