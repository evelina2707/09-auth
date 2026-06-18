import { NextResponse } from 'next/server';
import api from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const res = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          message: error.response?.data?.message || 'Unauthorized',
        },
        { status: error.response?.status || 401 }
      );
    }

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}