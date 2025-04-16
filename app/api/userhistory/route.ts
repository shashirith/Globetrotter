import { NextResponse } from "next/server";
import { getdbTable } from "../utils";
import { UserHistory } from "@/app/types/utils";

export async function GET(request: Request) {
  const username = request.headers.get("username") || "";
  const gameId = request.headers.get("game_id") || "";

  const userHistory = await (
    await getdbTable<UserHistory>("user_history")
  )
    .find({
      user_name: username,
      game_id: gameId,
    })
    .toArray();

  let correctAnswer = 0,
    incorrectAnswer = 0;

  const total = userHistory.length;
  let totalScored = 0;
  userHistory.forEach((stat) => {
    if (stat.is_correct) {
      correctAnswer++;
    } else {
      incorrectAnswer++;
    }
    totalScored += stat.score;
  });

  return NextResponse.json({
    correctAnswer,
    incorrectAnswer,
    total,
    totalScored,
  });
}
