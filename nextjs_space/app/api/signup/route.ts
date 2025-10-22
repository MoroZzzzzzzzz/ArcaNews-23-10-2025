
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, username } = body;

    if (!email || !password || !firstName || !lastName || !username) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const response = await apiClient.register({
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
