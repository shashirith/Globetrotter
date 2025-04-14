"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { QuizText } from "../enums";
import MotionDiv from "./MotionDiv";
import MotionButton from "./MotionButton";
import { ButtonVariant } from "../enums";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeCreated: (shareUrl: string) => void;
  score: {
    correct: number;
    incorrect: number;
  };
}

export default function ChallengeModal({
  isOpen,
  onClose,
  onChallengeCreated,
}: //TODO : need to add score here
// score,
ChallengeModalProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setShowSadFace] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowSadFace(false);

    try {
      // Create challenge
      const challengeResponse = await fetch("/api/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          username: localStorage.getItem("userName") || "",
          game_id: localStorage.getItem("gameId") || "",
        },
        body: JSON.stringify({ friendName: username }),
      });

      if (!challengeResponse.ok) {
        setShowSadFace(true);
        throw new Error("Failed to create challenge");
      }

      const challengeData = await challengeResponse.json();

      onChallengeCreated(challengeData.shareUrl);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Challenge a Friend
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div className="flex justify-end space-x-3">
                  <MotionButton
                    onClick={onClose}
                    variant={ButtonVariant.SECONDARY}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </MotionButton>
                  <MotionButton
                    disabled={isLoading}
                    variant={ButtonVariant.PRIMARY}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "Create Challenge"}
                  </MotionButton>
                </div>
              </form>
            </MotionDiv>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
}
