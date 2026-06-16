import css from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'Сторінку не знайдено. Спробуйте повернутися на головну або скористайтеся пошуком по нотатках.',
  openGraph: {
    title: '404 - Page not found | NoteHub',
    description: 'Сторінку не знайдено. Спробуйте повернутися на головну або скористайтеся пошуком по нотатках.',
    url: 'https://notehub.com/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Open Graph Image',
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </main>
  );
}