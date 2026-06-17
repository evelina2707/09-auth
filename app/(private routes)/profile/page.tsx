import type { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';
import css from './EditProfilePage.module.css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'Особистий профіль користувача NoteHub.',
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'Особистий профіль користувача NoteHub.',
    url: 'https://notehub.com/profile',
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

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}