import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { NextRequest } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function getCounter() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');

    console.log('Accessing database and collection...');
    const database = client.db('pump-counter');
    const counters = database.collection('counters');
    
    console.log('Fetching counter document...');
    const counter = await counters.findOne({ id: 'main-counter' });
    console.log('Counter document:', counter);

    if (!counter) {
      console.log('No counter found, creating initial counter...');
      await counters.insertOne({ id: 'main-counter', count: 0 });
      return 0;
    }
    
    return counter.count;
  } catch (error) {
    console.error('Detailed error in getCounter:', error);
    throw error;
  }
}

async function incrementCounter() {
  try {
    console.log('Connecting to MongoDB for increment...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');

    const database = client.db('pump-counter');
    const counters = database.collection('counters');
    
    console.log('Incrementing counter...');
    const result = await counters.findOneAndUpdate(
      { id: 'main-counter' },
      { $inc: { count: 1 } },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );
    
    console.log('Increment result:', result);
    
    // Get the updated document
    const updatedCounter = await counters.findOne({ id: 'main-counter' });
    console.log('Updated counter:', updatedCounter);
    
    return updatedCounter?.count || 0;
  } catch (error) {
    console.error('Detailed error in incrementCounter:', error);
    throw error;
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    console.log('Starting GET request...');
    const count = await getCounter();
    console.log('GET request successful, count:', count);
    return NextResponse.json({ count }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json(
      { error: 'Failed to get counter', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting POST request...');
    const newCount = await incrementCounter();
    console.log('POST request successful, new count:', newCount);
    return NextResponse.json({ count: newCount }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json(
      { error: 'Failed to increment counter', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
