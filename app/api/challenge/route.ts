import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// In-memory storage for users and challenges
// In a real app, this would be in a database
const users = new Map<
  string,
  { username: string; score: { correct: number; incorrect: number } }
>();

async function getdbTable<T = Document>(name: string) {
  const client = await clientPromise;
  const db = client.db("globethrotter");
  const collection = db.collection<T & Document>(name);
  return collection;
}

interface Challenge {
  user_name: string;
  friend_name: string;
  game_id: string;
  challenge_id: string;
  createdAt?: number;
}

const challenges = new Map<string, Challenge>();

export async function POST(request: Request) {
  try {
    const userName = request.headers.get("username") || "";
    const gameId = request.headers.get("game_id") || "";

    const { friendName } = await request.json();

    if (!userName || !gameId) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!friendName) {
      return NextResponse.json(
        { error: "Friend name is required" },
        { status: 400 }
      );
    }

    // Create or update user
    const challengeId = uuidv4();

    await (
      await getdbTable<Challenge>("challenges")
    ).insertOne({
      user_name: userName,
      friend_name: friendName,
      game_id: gameId,
      challenge_id: challengeId,
    } as Challenge & Document);

    return NextResponse.json({
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/challenge/${challengeId}`,
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userName = request.headers.get("username") || "";
  const challengeId = searchParams.get("id"); // pick it from path params

  if (!challengeId) {
    return NextResponse.json(
      { error: "Challenge ID is required" },
      { status: 400 }
    );
  }

  const challenge = await (
    await getdbTable<Challenge>("challenges")
  ).findOne({ challenge_id: challengeId, friend_name: userName });

  if (!challenge) {
    return NextResponse.json(
      { error: "Login with the correct user" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    gameId: challenge.game_id,
  });
}
