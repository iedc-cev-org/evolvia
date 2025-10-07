import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, score } = body;
    
    if (!userId || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid userId or score' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Update the user's score (add to existing score)
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { score: score }, // Add to existing score
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating user score:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to update score', 
      details: errorMessage 
    }, { status: 500 });
  }
}