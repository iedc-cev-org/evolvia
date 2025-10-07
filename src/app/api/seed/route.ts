import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Starting database seeding...');
    
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Clear existing data
    await usersCollection.deleteMany({});
    console.log('Cleared existing users');
    
    // Sample users data
    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        image: 'https://i.pravatar.cc/150?img=1',
        score: 1500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        image: 'https://i.pravatar.cc/150?img=2',
        score: 1250,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'mike.johnson@example.com',
        name: 'Mike Johnson',
        image: 'https://i.pravatar.cc/150?img=3',
        score: 980,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'sarah.wilson@example.com',
        name: 'Sarah Wilson',
        image: 'https://i.pravatar.cc/150?img=4',
        score: 750,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'alex.brown@example.com',
        name: 'Alex Brown',
        image: 'https://i.pravatar.cc/150?img=5',
        score: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert sample data
    const result = await usersCollection.insertMany(sampleUsers);
    console.log(`Inserted ${result.insertedCount} users`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded database with ${result.insertedCount} users`,
      insertedCount: result.insertedCount,
      users: sampleUsers.map(u => ({ name: u.name, email: u.email, score: u.score }))
    });
    
  } catch (error) {
    console.error('Seeding failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
      details: errorMessage
    }, { status: 500 });
  }
}