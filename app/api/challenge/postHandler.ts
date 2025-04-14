import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getdbTable } from "../utils";
import { Challenge } from "@/app/types/utils";
import { ErrorMessages } from "@/app/enums";

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
    console.error(ErrorMessages.CHALLENGE_CREATION_ERROR, error);
    return NextResponse.json(
      { error: ErrorMessages.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
