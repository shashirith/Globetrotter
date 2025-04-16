"use client";
{
  /**10 seconds per questions
10 points
0-2s - 10 points
2-4s - 8 points
4-6s - 6 points
6-8s - 4 points
8-10s - 2 points */
}
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import ChallengeModal from "../ChallengeModal";
import MotionButton from "../MotionButton";
import Text from "../Text";
import {
  TextVariant,
  HeadingLevel,
  ButtonVariant,
  ButtonSize,
  QuizText,
} from "../../enums";
import SadFaceAnimation from "../SadFaceAnimation";
import MotionDiv from "../MotionDiv";
import { Destination } from "@/app/types/utils";
import { api, getButtonVariant, getRandomImage } from "@/app/utils/quizutils";
import ScoreDisplay from "../ScoreDisplay";
import { TOTAL_QUESTIONS } from "@/app/constants";
export default function Quiz({ isChallenge = false }) {
  const timeRef = useRef<any | null>(null);
  const timeCounterRef = useRef<number>(0);
  const handleAnswerRef = useRef<any>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
    totalScored: 0,
  });
  const [showFunFact, setShowFunFact] = useState(false);
  const [showTrivia, setShowTrivia] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [, setShareUrl] = useState<string | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showSadFace, setShowSadFace] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [fetchNextQuestionState, setFetchNextQuestionState] = useState(false);

  const fetchNewQuestion = useCallback(async () => {
    setShowSadFace(false);
    setIsLoading(true);
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }

    try {
      const data = await api("/destinations", {
        headers: { is_challenge: isChallenge ? "true" : "false" },
      });

      setDestination(data.destination);
      setOptions(data.options);
      setSelectedAnswer(null);
      setShowFunFact(false);
      setShowTrivia(false);
      timeCounterRef.current = 0;
      setTimeLeft(10);
      timeRef.current = setInterval(() => {
        timeCounterRef.current++;
        setTimeLeft((prev) => prev - 1);
        if (timeCounterRef.current >= 10) {
          clearInterval(timeRef.current);
          handleAnswerRef.current?.("");
        }
      }, 1000);
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isChallenge]);

  useEffect(() => {
    const fetchUserHistory = async () => {
      const userHistory = await api("/userhistory");
      setScore({
        correct: userHistory.correctAnswer,
        incorrect: userHistory.incorrectAnswer,
        totalScored: userHistory.totalScored,
      });
      setQuestionsAnswered(userHistory.total);

      if (userHistory.total === TOTAL_QUESTIONS) {
        setIsChallengeModalOpen(true);
        return;
      }
    };
    fetchUserHistory();
  }, [fetchNewQuestion]);

  const handleAnswer = async (answer: string) => {
    setShowFunFact(true);
    const timeLapsed = timeCounterRef.current;

    try {
      const result = await api("/destinations", {
        method: "POST",
        body: JSON.stringify({
          id: destination?.id,
          selectedAnswer: answer,
          timeLapsed: timeLapsed,
        }),
      });

      setDestination(result.destination);

      if (result.isCorrect) {
        setScore((prev) => ({
          ...prev,
          correct: prev.correct + 1,
          totalScored: prev.totalScored + result.score,
        }));
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
      setTimeout(() => setFetchNextQuestionState((prev) => !prev), 3000);

      // Update state with trivia and fun facts
      setShowFunFact(true);
      setShowTrivia(true);
      setTimeout(() => setSelectedAnswer(answer), 100);
    } catch (error) {
      console.error("Error verifying answer:", error);
    }

    setQuestionsAnswered((prev) => prev + 1);
  };
  handleAnswerRef.current = handleAnswer;
  useEffect(() => {
    fetchNewQuestion();
  }, [fetchNextQuestionState]);

  const handleChallengeCreated = (url: string) => {
    setShareUrl(url);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      QuizText.CHALLENGE_MESSAGE.replace("{url}", url)
    )}&image=${encodeURIComponent(getRandomImage())}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="min-h-screen  container  bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      {showSadFace && (
        <div className="fixed inset-0 flex justify-center items-center  z-50">
          <SadFaceAnimation />
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center mb-8 ">
          <div className="text-center">
            <Text as={HeadingLevel.H1} variant={TextVariant.SECONDARY}>
              {QuizText.GAME_TITLE}
            </Text>
            <Text as={HeadingLevel.P} variant={TextVariant.INFO}>
              {QuizText.SCORE_TEXT.replace(
                "{correct}",
                score.correct.toString()
              ).replace("{incorrect}", score.incorrect.toString())}
            </Text>
            <Text as={HeadingLevel.P} variant={TextVariant.INFO}>
              Total Score: {score.totalScored}
            </Text>
            <Text as={HeadingLevel.P} variant={TextVariant.INFO}>
              Time Left in seconds: {timeLeft}
            </Text>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">{QuizText.LOADING}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div className="space-y-1">
                {questionsAnswered >= TOTAL_QUESTIONS && (
                  <div className="flex flex-col items-center ">
                    <Text
                      as={HeadingLevel.H2}
                      variant={TextVariant.SECONDARY}
                      className="text-center"
                    >
                      <ScoreDisplay
                        score={score.correct}
                        total={questionsAnswered}
                      />
                      Total Score
                    </Text>
                    <div className="mt-6 flex justify-center items-center gap-4">
                      <div className="space-y-4">
                        <MotionButton
                          onClick={() => setIsChallengeModalOpen(true)}
                          variant={ButtonVariant.SUCCESS}
                          size={ButtonSize.MEDIUM}
                        >
                          {QuizText.CHALLENGE_FRIEND}
                        </MotionButton>
                      </div>
                      <MotionButton
                        onClick={() => {
                          setQuestionsAnswered(0);
                          setScore({
                            correct: 0,
                            incorrect: 0,
                            totalScored: 0,
                          });
                          fetchNewQuestion();
                        }}
                        variant={ButtonVariant.DANGER}
                        size={ButtonSize.MEDIUM}
                      >
                        {QuizText.PLAY_AGAIN}
                      </MotionButton>
                    </div>
                  </div>
                )}
                {destination?.clues.map((clue, index) => (
                  <Text
                    key={index + clue}
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
                    <Text variant={TextVariant.SECONDARY} className="p-4 ">
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
                    {destination?.funFacts ? (
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <Text
                          as={HeadingLevel.H3}
                          variant={TextVariant.SECONDARY}
                        >
                          {QuizText.FUN_FACT}
                        </Text>
                        <Text
                          as={HeadingLevel.P}
                          variant={TextVariant.SECONDARY}
                        >
                          {destination?.funFacts}
                        </Text>
                      </div>
                    ) : null}
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
                    {destination?.trivia ? (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <Text
                          as={HeadingLevel.H3}
                          variant={TextVariant.SECONDARY}
                        >
                          {QuizText.TRIVIA}
                        </Text>
                        <Text
                          as={HeadingLevel.P}
                          variant={TextVariant.SECONDARY}
                        >
                          {destination?.trivia}
                        </Text>
                      </div>
                    ) : null}
                  </MotionDiv>
                </AnimatePresence>
              )}

              {selectedAnswer && questionsAnswered < TOTAL_QUESTIONS && (
                <MotionButton
                  onClick={fetchNewQuestion}
                  variant={ButtonVariant.PRIMARY}
                  className="w-full p-4 text-white rounded-lg font-bold"
                >
                  <Text variant={TextVariant.SECONDARY} className="text-white">
                    {QuizText.NEXT_DESTINATION}
                  </Text>
                </MotionButton>
              )}
            </div>
            {questionsAnswered < TOTAL_QUESTIONS && (
              <MotionButton
                onClick={() => {
                  setQuestionsAnswered(0);
                  setScore({ correct: 0, incorrect: 0, totalScored: 0 });
                  fetchNewQuestion();
                }}
                variant={ButtonVariant.DANGER}
                size={ButtonSize.MEDIUM}
                className="mt-4"
              >
                {QuizText.PLAY_AGAIN}
              </MotionButton>
            )}
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
