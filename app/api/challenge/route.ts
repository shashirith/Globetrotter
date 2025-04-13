import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for users and challenges
// In a real app, this would be in a database
const users = new Map<string, { username: string; score: { correct: number; incorrect: number } }>();
const challenges = new Map<string, { userId: string; createdAt: number }>();

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Create or update user
    const userId = uuidv4();
    users.set(userId, {
      username,
      score: { correct: 0, incorrect: 0 }
    });

    // Create challenge
    const challengeId = uuidv4();
    challenges.set(challengeId, {
      userId,
      createdAt: Date.now()
    });

    return NextResponse.json({
      userId,
      challengeId,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/challenge/${challengeId}`
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get('id');

  if (!challengeId) {
    return NextResponse.json({ error: 'Challenge ID is required' }, { status: 400 });
  }

  const challenge = challenges.get(challengeId);
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  const user = users.get(challenge.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    username: user.username,
    score: user.score
  });
} 