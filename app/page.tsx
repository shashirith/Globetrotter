"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import ChallengeModal from "./components/ChallengeModal";
import MotionButton from "./components/MotionButton";
import Text from "./components/Text";
import {
  TextVariant,
  TextSize,
  HeadingLevel,
  ButtonVariant,
  ButtonSize,
  TextContent,
} from "./enums";
import SadFaceAnimation from "./components/SadFaceAnimation";

interface Destination {
  id: number;
  name: string;
  country: string;
  clues: string[];
  funFacts: string[];
  trivia: string[];
}

export default function Home() {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [showFunFact, setShowFunFact] = useState(false);
  const [showTrivia, setShowTrivia] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showSadFace, setShowSadFace] = useState(false);

  const fetchNewQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/destinations");
      const data = await response.json();
      console.log(data, "data");
      setDestination(data.destinations[0]);
      setOptions(data.options);
      setSelectedAnswer(null);
      setShowFunFact(false);
      setShowTrivia(false);
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);
  console.log(destination, "destination");

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFunFact(true);

    if (answer === `${destination?.name}, ${destination?.country}`) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setShowSadFace(true);
    }

    setQuestionsAnswered((prev) => prev + 1);

    // if (questionsAnswered + 1 >= 10) {
    //   setIsChallengeModalOpen(true);
    // }
  };

  const handleChallengeCreated = (url: string) => {
    setShareUrl(url);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      TextContent.CHALLENGE_MESSAGE.replace("{url}", url)
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen  container  bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      {showSadFace && <SadFaceAnimation />}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Text as={HeadingLevel.H1} variant={TextVariant.PRIMARY}>
              {TextContent.GAME_TITLE}
            </Text>
            <Text as={HeadingLevel.P} variant={TextVariant.INFO}>
              {TextContent.SCORE_TEXT.replace(
                "{correct}",
                score.correct.toString()
              ).replace("{incorrect}", score.incorrect.toString())}
            </Text>
          </div>
          {/* <MotionButton
            onClick={() => setIsChallengeModalOpen(true)}
            variant={ButtonVariant.SUCCESS}
            size={ButtonSize.MEDIUM}
          >
            {TextContent.CHALLENGE_FRIEND}
          </MotionButton> */}
        </div>

        {isLoading ? (
          <div className="text-center">{TextContent.LOADING}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                {destination?.clues.map((clue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-blue-50 p-4 rounded-lg"
                  >
                    <Text as={HeadingLevel.P} variant={TextVariant.SECONDARY}>
                      {clue}
                    </Text>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-2">
                {options.map((option, index) => (
                  <motion.button
                    key={index + option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      !selectedAnswer
                        ? "bg-blue-100 hover:bg-blue-200"
                        : option ===
                          `${destination?.name}, ${destination?.country}`
                        ? "bg-green-200"
                        : option === selectedAnswer
                        ? "bg-red-200"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text variant={TextVariant.SECONDARY}>{option}</Text>
                  </motion.button>
                ))}
              </div>

              {showFunFact && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <Text as={HeadingLevel.H3} variant={TextVariant.PRIMARY}>
                        {TextContent.FUN_FACT}
                      </Text>
                      <Text as={HeadingLevel.P} variant={TextVariant.SECONDARY}>
                        {
                          destination?.funFacts[
                            Math.floor(
                              Math.random() * destination.funFacts.length
                            )
                          ]
                        }
                      </Text>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
              <MotionButton
                onClick={() => {
                  setQuestionsAnswered(0);
                  setScore({ correct: 0, incorrect: 0 });
                  fetchNewQuestion();
                }}
                variant={ButtonVariant.PRIMARY}
                size={ButtonSize.MEDIUM}
              >
                Play Again
              </MotionButton>

              {selectedAnswer && questionsAnswered < 10 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchNewQuestion}
                  className="w-full p-4 bg-blue-600 text-white rounded-lg font-bold"
                >
                  <Text variant={TextVariant.SECONDARY}>
                    {TextContent.NEXT_DESTINATION}
                  </Text>
                </motion.button>
              )}

              {questionsAnswered >= 10 && (
                <div>
                  <Text as={HeadingLevel.P} variant={TextVariant.SECONDARY}>
                    You total score is {score.correct}
                  </Text>
                  <div className="mt-6 space-y-4">
                    <MotionButton
                      onClick={() => setIsChallengeModalOpen(true)}
                      variant={ButtonVariant.SUCCESS}
                      size={ButtonSize.MEDIUM}
                    >
                      Challenge a Friend
                    </MotionButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        onChallengeCreated={handleChallengeCreated}
        score={score}
      />
    </div>
  );
}
