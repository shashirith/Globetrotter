import { NextResponse } from "next/server";
import { getdbTable } from "../utils";
import { Challenge } from "@/app/types/utils";
import { ErrorMessages } from "@/app/enums";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userName = request.headers.get("username") || "";
  const challengeId = searchParams.get("id");
  if (!challengeId) {
    return NextResponse.json(
      { error: ErrorMessages.MISSING_CHALLENGE_ID },
      { status: 400 }
    );
  }

  const challenge = await (
    await getdbTable<Challenge>("challenges")
  ).findOne({ challenge_id: challengeId, friend_name: userName });

  if (!challenge) {
    return NextResponse.json(
      { error: ErrorMessages.INCORRECT_USER_LOGIN },
      { status: 403 }
    );
  }

  return NextResponse.json({
    gameId: challenge.game_id,
  });
}
