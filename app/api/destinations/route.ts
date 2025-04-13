import { NextResponse } from "next/server";
import { destinations } from "@/app/lib/destinations";

interface Destination {
  id: number;
  name: string;
  country: string;
  clues: string[];
  funFacts: string[];
  trivia: string[];
}

export async function GET() {
  // Get a random destination
  const randomIndex = Math.floor(Math.random() * destinations.length);
  const destination = destinations[randomIndex];

  // Select 2 random clues
  const selectedClues = destination.clues
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  // Get 3 random destinations for options (including the correct one)
  const options = destinations
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((d: Destination) => `${d.name}, ${d.country}`);

  // If the correct answer isn't in the options, replace one with it
  const correctAnswer = `${destination.name}, ${destination.country}`;
  if (!options.includes(correctAnswer)) {
    options[Math.floor(Math.random() * 3)] = correctAnswer;
  }

  return NextResponse.json({
    destination: {
      id: destination.id,
      name: destination.name,
      country: destination.country,
      clues: selectedClues,
      funFacts: destination.funFacts,
      trivia: destination.trivia,
    },
    options: options.sort(() => 0.5 - Math.random()),
  });
}
