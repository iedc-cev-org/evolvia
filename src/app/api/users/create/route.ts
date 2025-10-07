import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    const count = await usersCollection.countDocuments();
    const users = await usersCollection.find({}).limit(5).toArray();
    
    return NextResponse.json({
      success: true,
      totalUsers: count,
      sampleUsers: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, score = 0 } = body;
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    
    // Create new user
    const newUser = {
      email,
      name,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      score: Number(score),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await usersCollection.insertOne(newUser);
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: result.insertedId,
      user: newUser
    });
    
  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create user',
      details: errorMessage
    }, { status: 500 });
  }
}