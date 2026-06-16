'use client';

import NoteForm from '@/components/NoteForm/NoteForm';
import { useRouter } from 'next/navigation';

export default function CreateNoteClient() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/notes');
  };

  return <NoteForm onCancel={handleCancel} />;
}