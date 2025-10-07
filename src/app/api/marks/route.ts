import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection('marks');
  
  const url = new URL(req.url);
  const name = url.searchParams.get('name');
  
  if (name) {
    // Get marks for specific player
    const items = await coll.find({ name: { $regex: new RegExp(name, 'i') } }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(items);
  } else {
    // Get all marks for leaderboard
    const items = await coll.find({}).sort({ score: -1, createdAt: 1 }).toArray();
    return NextResponse.json(items);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, score } = body;
  if (!name || typeof score !== 'number') return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection('marks');
  const now = new Date();
  const res = await coll.insertOne({ name, score, createdAt: now });
  return NextResponse.json({ insertedId: res.insertedId });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection('marks');
  const { ObjectId } = await import('mongodb');
  const res = await coll.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ deletedCount: res.deletedCount });
}
