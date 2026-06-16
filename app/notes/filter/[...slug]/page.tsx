import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { slug: string[] } }
): Promise<Metadata> {
  const slug = params.slug || [];
  const filter = slug.length ? slug.join(' / ') : 'Усі нотатки';
  const title = `Фільтр: ${filter} | NoteHub`;
  const description = `Перегляд нотаток, відфільтрованих за: ${filter}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${slug.join('/')}`,
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
}

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const isAll = !slug || slug[0] === 'all';
  const tag = isAll ? undefined : slug[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: '',
        perPage: 12,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}