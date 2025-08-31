import { NextRequest, NextResponse } from 'next/server';
import { getAllPodcasts, getPodcastsByUserId } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    
    if (type === 'my') {
      // Get user's podcasts
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json([], { status: 200 });
      }
      
      const userPodcasts = await getPodcastsByUserId(session.user.email);
      return NextResponse.json(userPodcasts);
    } else {
      // Get all podcasts
      const allPodcasts = await getAllPodcasts();
      return NextResponse.json(allPodcasts);
    }
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcasts' },
      { status: 500 }
    );
  }
}
