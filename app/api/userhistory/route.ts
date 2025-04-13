import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

async function getdbTable<T = Document>(name: string) {
  const client = await clientPromise;
  const db = client.db("globethrotter");
  const collection = db.collection<T & Document>(name);
  return collection;
}

interface UserHistory {
  user_name: string;
  game_id: string;
  destination_id: number;
  date: Date;
  is_correct: boolean;
}

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
    incorrectAnswer = 0,
    total = userHistory.length;

  userHistory.forEach((stat) => {
    if (stat.is_correct) {
      correctAnswer++;
    } else {
      incorrectAnswer++;
    }
  });

  return NextResponse.json({
    correctAnswer,
    incorrectAnswer,
    total,
  });
}
