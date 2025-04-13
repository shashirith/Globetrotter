import { NextResponse } from "next/server";
import { destinations } from "@/app/lib/destinations";
import clientPromise from "../../lib/mongodb";

interface Destination {
  id: number;
  name: string;
  country: string;
  clues: string[];
  funFacts: string[];
  trivia: string[];
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("globethrotter");
    const collection = db.collection("destinations");
    const destinations = (await collection.find({}).toArray()).map((doc) => ({
      id: doc.id,
      name: doc.name,
      country: doc.country,
      clues: doc.clues,
      funFacts: doc.funFacts,
      trivia: doc.trivia,
    })) as Destination[];
    const options = destinations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((d) => `${d.name}, ${d.country}`);

    // Select a random destination for the correct answer
    const destination =
      destinations[Math.floor(Math.random() * destinations.length)];
    const correctAnswer = `${destination.name}, ${destination.country}`;

    // If the correct answer isn't in the options, replace one with it
    if (!options.includes(correctAnswer)) {
      options[Math.floor(Math.random() * 3)] = correctAnswer;
    }

    console.log(options);

    return NextResponse.json({
      destinations: destinations,
      options: options,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const client = await clientPromise;
//     const db = client.db("globethrotter");

//     // Perform database operations
//     const collection = db.collection("destinations");
//     const data = await collection.find({}).toArray();

//     res.status(200).json(data);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
