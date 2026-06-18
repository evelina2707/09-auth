import { NextRequest, NextResponse } from 'next/server';
import api from '@/lib/api/api';
import { isAxiosError } from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post('/auth/login', body);

    const response = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });

    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookies = Array.isArray(setCookie)
        ? setCookie
        : [setCookie];

      cookies.forEach((cookie) => {
        response.headers.append('Set-Cookie', cookie);
      });
    }

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          message: error.response?.data?.message || 'Login failed',
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