import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json({ 
        error: 'Database configuration missing. Please set up MONGODB_URI in .env.local' 
      }, { status: 500 });
    }

    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB client connected successfully');
    
    const db = client.db();
    console.log('Database instance created');
    
    const usersCollection = db.collection('users');
    console.log('Users collection accessed');
    
    // Get all users sorted by score (descending)
    const users = await usersCollection.find({}).sort({ score: -1, createdAt: 1 }).toArray();
    console.log(`Found ${users.length} users`);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Detailed error in GET /api/users:', error);
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        return NextResponse.json({ 
          error: 'Cannot connect to MongoDB. Please check your internet connection and MongoDB URI.',
          details: error.message 
        }, { status: 500 });
      }
      
      if (error.message.includes('authentication')) {
        return NextResponse.json({ 
          error: 'MongoDB authentication failed. Please check your username and password in the URI.',
          details: error.message 
        }, { status: 500 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to fetch users', 
      details: errorMessage 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        error: 'Database configuration missing. Please set up MONGODB_URI in .env.local' 
      }, { status: 500 });
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { score } = body;
    
    if (typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Update the user's score
    const result = await usersCollection.updateOne(
      { email: session.user.email },
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