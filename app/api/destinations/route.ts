import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { getdbTable } from "../utils";
import {
  Destination,
  GetNextQuestionIndexProps,
  UserHistory,
} from "@/app/types/utils";
import { ApiMessages } from "@/app/enums/apienums";
let userStartIndex = 0;
const MAX_DESTINATIONS_COUNT = 100;

const getRandomNumber = (name: string, notTheseNumbers: number[] = []) => {
  if (name === ApiMessages.Anonymous) {
    userStartIndex = (userStartIndex + 1) % MAX_DESTINATIONS_COUNT;
    return userStartIndex++;
  }

  const number = Math.floor(Math.random() * MAX_DESTINATIONS_COUNT);

  if (notTheseNumbers.includes(number)) {
    return getRandomNumber(name, notTheseNumbers);
  }

  return number;
};

const getSolvedDestinations = async (query: Partial<UserHistory>) => {
  const solvedDestinations = await getdbTable<UserHistory>("user_history");
  const data = await solvedDestinations.find(query).toArray();

  return data.map((d) => d.destination_id);
};

const getNextQuestionIndex = async ({
  name,
  isChallenge,
  gameId,
}: GetNextQuestionIndexProps) => {
  if (isChallenge === "true") {
    const solvedDestinationsByGameId = await getSolvedDestinations({
      game_id: gameId,
    });
    const solvedHistoryByUserName = await getSolvedDestinations({
      user_name: name,
    }); // current user history
    const solvedLength = solvedHistoryByUserName.length;

    if (solvedLength === solvedDestinationsByGameId.length) {
      return null;
    }

    return solvedDestinationsByGameId[solvedLength + 1];
  }

  const solvedDestinations = await getSolvedDestinations({ user_name: name });

  return getRandomNumber(name, solvedDestinations);
};
const getScore = (timeLapsed: number) => {
  if (timeLapsed < 2) {
    return 10;
  }
  if (timeLapsed < 4) {
    return 8;
  }
  if (timeLapsed < 6) {
    return 6;
  }
  if (timeLapsed < 8) {
    return 4;
  }
  if (timeLapsed < 10) {
    return 2;
  }

  return 0;
};

export async function POST(request: Request) {
  try {
    const userName: string =
      request.headers.get("username") || ApiMessages.Anonymous;
    const gameId = request.headers.get("game_id") || "";

    const { id, selectedAnswer, timeLapsed } = await request.json();

    const client = await clientPromise;
    const db = client.db("globethrotter");
    const destinationsTable = db.collection<Destination>("destinations");

    // Find the destination that matches the clue
    const destination = await destinationsTable.findOne({
      id: { $eq: id },
    });

    if (!destination) {
      return NextResponse.json(
        { error: ApiMessages.NoDestinationFound },
        { status: 404 }
      );
    }

    // Check if the selected answer matches the destination
    const correctAnswer = `${destination.name}, ${destination.country}`;
    const isCorrect = selectedAnswer === correctAnswer;
    const score = isCorrect ? getScore(timeLapsed) : 0;
    if (userName !== ApiMessages.Anonymous) {
      await (
        await getdbTable<UserHistory>("user_history")
      ).insertOne({
        user_name: userName,
        game_id: gameId,
        destination_id: id,
        date: new Date(),
        is_correct: isCorrect,
        score: score,
      } as UserHistory & Document);
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer,
      score,
      destination,
      message: isCorrect
        ? ApiMessages.CorrectAnswer
        : ApiMessages.IncorrectAnswer,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: ApiMessages.InternalServerError },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const username: string =
      request.headers.get("username") || ApiMessages.Anonymous;
    const gameId = request.headers.get("game_id") || "";
    const isChallenge = request.headers.get("is_challenge") || "false";

    const nextQuestionIndex = await getNextQuestionIndex({
      name: username,
      isChallenge,
      gameId,
    });

    if (isChallenge === "true" && nextQuestionIndex === null) {
      return NextResponse.json(
        { error: ApiMessages.NoMoreQuestions },
        { status: 404 }
      );
    }

    const destinationsTable = await getdbTable<Destination>("destinations");

    const idsToFind = Array.from(
      { length: 4 },
      (_, i) => ((nextQuestionIndex ?? 0) + i) % MAX_DESTINATIONS_COUNT
    );

    const destinations = await destinationsTable
      .find({
        id: { $in: idsToFind },
      })
      .toArray();

    const destination = destinations[0];

    if (!destination) {
      return NextResponse.json(
        {
          error: ApiMessages.NoDestinationFound + nextQuestionIndex,
        },
        { status: 500 }
      );
    }

    const options = destinations
      .sort(() => 0.5 - Math.random())
      .map((d) => `${d.name}, ${d.country}`);

    return NextResponse.json({
      destination: { id: destination.id, clues: destination.clues },
      options,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: ApiMessages.InternalServerError },
      { status: 500 }
    );
  }
}
