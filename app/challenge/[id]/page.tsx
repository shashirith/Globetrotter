"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Quiz from "@/app/components/Quiz";

interface ChallengeData {
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
}

export default function ChallengePage() {
  const { id } = useParams();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let username = localStorage.getItem("userName") || "";

    if (!username) {
      username = prompt("Please enter your username") || "";

      if (!username) {
        setError("Username is required");
        return;
      }

      localStorage.setItem("userName", username || "");
    }

    const fetchChallengeData = async () => {
      try {
        const response = await fetch(`/api/challenge?id=${id}`, {
          headers: { username },
        });

        if (!response.ok) {
          throw new Error("Challenge not found");
        }
        const data = await response.json();
        setChallengeData(data);
        // setGameId(data.gameId);
        localStorage.setItem("gameId", data.gameId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    // cleanup code
    fetchChallengeData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-800">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return <Quiz isChallenge={true} />;
}
