import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== Testing MongoDB Connection ===');
  
  // Check environment variables first
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set');
    return NextResponse.json({ 
      success: false,
      error: 'MONGODB_URI environment variable is not set',
      envCheck: false
    }, { status: 500 });
  }
  
  console.log('MONGODB_URI is set:', process.env.MONGODB_URI.substring(0, 20) + '...');
  
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('Client connection successful');
    
    const db = client.db();
    console.log('Database instance created, name:', db.databaseName);
    
    // Test basic operation
    console.log('Testing database operation...');
    const adminDb = db.admin();
    const serverStatus = await adminDb.serverStatus();
    console.log('Server status check successful');
    
    // Try to list collections
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      dbName: db.databaseName,
      collections: collections.length,
      serverVersion: serverStatus.version,
      connectionString: process.env.MONGODB_URI.substring(0, 30) + '...'
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    let errorType = 'Unknown';
    if (errorMessage.includes('ENOTFOUND')) {
      errorType = 'DNS Resolution Failed - Check hostname in URI';
    } else if (errorMessage.includes('ECONNREFUSED')) {
      errorType = 'Connection Refused - Check if MongoDB is running';
    } else if (errorMessage.includes('authentication')) {
      errorType = 'Authentication Failed - Check username/password';
    } else if (errorMessage.includes('timeout')) {
      errorType = 'Connection Timeout - Check network/firewall';
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'MongoDB connection failed',
      errorType: errorType,
      details: errorMessage,
      uri: process.env.MONGODB_URI.substring(0, 30) + '...'
    }, { status: 500 });
  }
}