import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    
    if (!name || name.length < 2) {
      return NextResponse.json([]);
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Search users by name (case-insensitive)
    const users = await usersCollection.find({
      name: { $regex: new RegExp(name, 'i') }
    }).sort({ score: -1 }).limit(10).toArray();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to search users', 
      details: errorMessage 
    }, { status: 500 });
  }
}