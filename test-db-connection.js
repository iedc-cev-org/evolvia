// Simple MongoDB connection test
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return;
  }
  
  console.log('📡 Connecting to:', uri.substring(0, 30) + '...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    const db = client.db();
    console.log('📊 Database name:', db.databaseName);
    
    // Test basic operation
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log('👥 Current users in database:', userCount);
    
    await client.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Check your internet connection and hostname in URI');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Check your username and password in URI');
    }
  }
}

testConnection();