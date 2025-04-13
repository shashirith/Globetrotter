"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import ChallengeModal from "../ChallengeModal";
import MotionButton from "../MotionButton";
import Text from "../Text";
import {
  TextVariant,
  TextSize,
  HeadingLevel,
  ButtonVariant,
  ButtonSize,
  TextContent,
} from "../../enums";
import SadFaceAnimation from "../SadFaceAnimation";
import { v4 as uuidv4 } from "uuid";
import MotionDiv from "../MotionDiv";

interface Destination {
  id: number;
  name: string;
  country: string;
  clues: string[];
  funFacts: string[];
  trivia: string[];
}

const getUserName = () => {
  const userName = localStorage.getItem("userName");

  if (userName) {
    return userName;
  }

  const newUserName = uuidv4();
  localStorage.setItem("userName", newUserName);

  return newUserName;
};

const generateNewGameId = () => {
  const newGameId = uuidv4();
  localStorage.setItem("gameId", newGameId);
  return newGameId;
};

const getGameId = () => {
  const gameId = localStorage.getItem("gameId");
  if (!gameId) {
    return generateNewGameId();
  }
  return gameId;
};

const api = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      username: getUserName(),
      game_id: getGameId(),
      ...options.headers,
    },
  });

  return response.json();
};

const getButtonVariant = (
  option: string,
  selectedAnswer: string | null,
  destination: Destination | null
) => {
  if (!selectedAnswer) return ButtonVariant.PRIMARY;
  if (option === `${destination?.name}, ${destination?.country}`)
    return ButtonVariant.SUCCESS;
  if (option === selectedAnswer) return ButtonVariant.DANGER;
  return ButtonVariant.SECONDARY;
};

export default function Quiz({ isChallenge = false }) {
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
    setShowSadFace(false);
    setIsLoading(true);
    try {
      const data = await api("/destinations", {
        headers: { is_challenge: isChallenge ? "true" : "false" },
      });

      setDestination(data.destination);
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
    const fetchUserHistory = async () => {
      const userHistory = await api("/userhistory");
      setScore({
        correct: userHistory.correctAnswer,
        incorrect: userHistory.incorrectAnswer,
      });
      setQuestionsAnswered(userHistory.total);

      if (userHistory.total === 10) {
        setIsChallengeModalOpen(true);
        return;
      }
      fetchNewQuestion();
    };
    fetchUserHistory();
  }, []);

  console.log(destination, "destination");

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowFunFact(true);

    try {
      const result = await api("/destinations", {
        method: "POST",
        body: JSON.stringify({
          id: destination?.id,
          selectedAnswer: answer,
        }),
      });

      setDestination(result.destination);

      if (result.isCorrect) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
        setShowSadFace(true);
        setTimeout(() => setShowSadFace(false), 2000);
      }

      // Update state with trivia and fun facts
      setShowFunFact(true);
      setShowTrivia(true);
    } catch (error) {
      console.error("Error verifying answer:", error);
    }

    setQuestionsAnswered((prev) => prev + 1);
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
      {showSadFace && (
        <div className="fixed inset-0 flex justify-center items-center  z-50">
          <SadFaceAnimation />
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center mb-8 font-serif">
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
        </div>

        {isLoading ? (
          <div className="text-center">{TextContent.LOADING}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div className="space-y-1">
                {destination?.clues.map((clue, index) => (
                  <Text
                    as={HeadingLevel.P}
                    variant={TextVariant.SECONDARY}
                    bold
                  >
                    {clue}
                  </Text>
                ))}
              </div>

              <div className="space-y-2">
                {options.map((option, index) => (
                  <MotionButton
                    key={index + option}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    variant={getButtonVariant(
                      option,
                      selectedAnswer,
                      destination
                    )}
                    className="w-full p-10 rounded-lg text-left"
                  >
                    <Text variant={TextVariant.PRIMARY} className="p-4 ">
                      {option}
                    </Text>
                  </MotionButton>
                ))}
              </div>

              {showFunFact && (
                <AnimatePresence>
                  <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <Text as={HeadingLevel.H3} variant={TextVariant.PRIMARY}>
                        {TextContent.FUN_FACT}
                      </Text>
                      <Text as={HeadingLevel.P} variant={TextVariant.SECONDARY}>
                        {destination?.funFacts}
                      </Text>
                    </div>
                  </MotionDiv>
                </AnimatePresence>
              )}

              {showTrivia && (
                <AnimatePresence>
                  <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="p-4 bg-green-50 rounded-lg">
                      <Text as={HeadingLevel.H3} variant={TextVariant.PRIMARY}>
                        {TextContent.TRIVIA}
                      </Text>
                      <Text as={HeadingLevel.P} variant={TextVariant.SECONDARY}>
                        {destination?.trivia}
                      </Text>
                    </div>
                  </MotionDiv>
                </AnimatePresence>
              )}

              {selectedAnswer && questionsAnswered < 10 && (
                <MotionButton
                  onClick={fetchNewQuestion}
                  variant={ButtonVariant.PRIMARY}
                  className="w-full p-4 text-white rounded-lg font-bold"
                >
                  <Text variant={TextVariant.SECONDARY} className="text-white">
                    {TextContent.NEXT_DESTINATION}
                  </Text>
                </MotionButton>
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
            <MotionButton
              onClick={() => {
                setQuestionsAnswered(0);
                setScore({ correct: 0, incorrect: 0 });
                fetchNewQuestion();
              }}
              variant={ButtonVariant.SECONDARY}
              size={ButtonSize.MEDIUM}
              className="mt-4"
            >
              ↻ Play Again
            </MotionButton>
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
