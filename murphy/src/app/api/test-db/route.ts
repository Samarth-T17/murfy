import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/firebase';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      status: 'success', 
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
