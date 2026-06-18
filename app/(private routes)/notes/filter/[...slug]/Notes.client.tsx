'use client';

import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import css from '@/components/NotesPage/NotesPage.module.css';
import Link from 'next/link';
import { NoteTag, NotesResponse } from '@/types/note';

type Props = {
  tag?: NoteTag;
};

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const { data, isLoading, error } = useQuery<NotesResponse>({
    queryKey: ['notes', page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        perPage: 12,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;
  if (!data || !data.notes) return <p>No notes found.</p>;
  
  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          pageCount={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found.</p>
      )}
    </main>
  );
}