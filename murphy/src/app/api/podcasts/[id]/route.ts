import { NextRequest, NextResponse } from 'next/server';
import { getPodcastById } from '@/lib/firebase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const podcast = await getPodcastById(resolvedParams.id);
    
    if (!podcast) {
      return NextResponse.json(
        { error: 'Podcast not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(podcast);
  } catch (error) {
    console.error('Error fetching podcast:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcast' },
      { status: 500 }
    );
  }
}
