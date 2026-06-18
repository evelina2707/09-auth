'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { NoteTag } from '@/types/note';
import { createNote } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const validate = () => {
    const newErrors: typeof errors = {};
    if (draft.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }
    if (draft.title.trim().length > 50) {
      newErrors.title = 'Title must be no more than 50 characters.';
    }
    if (draft.content.length > 500) {
      newErrors.content = 'Content must be no more than 500 characters.';
    }
    if (!TAGS.includes(draft.tag as NoteTag)) {
      newErrors.tag = 'Please select a valid tag.';
    }
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(draft);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} autoComplete="off">
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          minLength={3}
          maxLength={50}
          required
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          maxLength={500}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
          required
        >
          {TAGS.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
          disabled={isSubmitting || createMutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting || createMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}