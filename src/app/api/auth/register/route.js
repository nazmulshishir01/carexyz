import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { getCollection } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { name, email, password, nid, contact } = await request.json();

    // Validation
    if (!name || !email || !password || !nid || !contact) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 6 characters with 1 uppercase and 1 lowercase letter',
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if NID already exists
    const existingNid = await usersCollection.findOne({ nid });
    if (existingNid) {
      return NextResponse.json(
        { error: 'User with this NID already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      nid,
      contact,
      provider: 'credentials',
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
