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
          content: '<div>hi</div>',
        },
        {
          targetIds: ['button-docs'],
          title: 'Check out the docs!',
        },
      ],
    });
  };

  return (
    <main className="overflow-x-hidden">
      <NextSeo
        title={'react-tutorial-overlay'}
        description="A headless library that makes it easy to put tutorials on top of the screen."
      />
      <div className="container prose mx-auto flex flex-col items-center justify-center">
        <h1 className="my-20">React Tutorial Overlay</h1>
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
