import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

interface Destination {
  id: number;
  name: string;
  country: string;
  clues: string[];
  funFacts: string[];
  trivia: string[];
}

interface UserHistory {
  user_name: string;
  game_id: string;
  destination_id: number;
  date: Date;
  is_correct: boolean;
}

//make this common
async function getdbTable<T = Document>(name: string) {
  const client = await clientPromise;
  const db = client.db("globethrotter");
  const collection = db.collection<T & Document>(name);
  return collection;
}

const OPTIONS_COUNT = 4;
let userStartIndex = 0;
const MAX_DESTINATIONS_COUNT = 100;

const getRandomNumber = (name: string, notTheseNumbers: number[] = []) => {
  if (name === "anonymous") {
    userStartIndex = (userStartIndex + 1) % MAX_DESTINATIONS_COUNT;
    return userStartIndex++;
  }

  const number = Math.floor(Math.random() * MAX_DESTINATIONS_COUNT);

  if (notTheseNumbers.includes(number)) {
    return getRandomNumber(name, notTheseNumbers);
  }

  return number;
};

const getSolvedDestinations = async (query: any) => {
  const solvedDestinations = await getdbTable<UserHistory>("user_history");
  const data = await solvedDestinations.find(query).toArray();

  return data.map((d) => d.destination_id);
};

const getNextQuestionIndex = async ({
  name,
  isChallenge,
  gameId,
}: {
  name: string;
  isChallenge: string;
  gameId: string;
}) => {
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

export async function POST(request: Request) {
  try {
    const userName = request.headers.get("username") || "anonymous";
    const gameId = request.headers.get("game_id") || "";

    const { id, selectedAnswer } = await request.json();

    const client = await clientPromise;
    const db = client.db("globethrotter");
    const destinationsTable = db.collection<Destination>("destinations");

    // Find the destination that matches the clue
    const destination = await destinationsTable.findOne({
      id: { $eq: id },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "No destination found for the given Id." },
        { status: 404 }
      );
    }

    // Check if the selected answer matches the destination
    const correctAnswer = `${destination.name}, ${destination.country}`;
    const isCorrect = selectedAnswer === correctAnswer;
    if (userName !== "anonymous") {
      await (
        await getdbTable<UserHistory>("user_history")
      ).insertOne({
        user_name: userName,
        game_id: gameId,
        destination_id: id,
        date: new Date(),
        is_correct: isCorrect,
      } as UserHistory & Document);
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer,
      destination,
      message: isCorrect
        ? "Correct! You've matched the clue with the right destination."
        : "Incorrect. Try again!",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const username = request.headers.get("username") || "anonymous";
    const gameId = request.headers.get("game_id") || "";
    const isChallenge = request.headers.get("is_challenge") || "false";

    const nextQuestionIndex = await getNextQuestionIndex({
      name: username,
      isChallenge,
      gameId,
    });

    if (isChallenge === "true" && nextQuestionIndex === null) {
      return NextResponse.json({ error: "No more questions" }, { status: 404 });
    }

    const destinationsTable = await getdbTable<Destination>("destinations");
    console.log(nextQuestionIndex, "nextQuestionIndex");

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
          error: "No destination found for the given Id. " + nextQuestionIndex,
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
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
