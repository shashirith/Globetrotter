export * from "./text";
export * from "./button";

export enum QuizText {
  // Game related
  GAME_TITLE = "GLOBETROTTER",
  SCORE_TEXT = "Score: {correct} correct, {incorrect} incorrect",
  NEXT_DESTINATION = "Next Question",
  CHALLENGE_FRIEND = "Challenge a Friend",
  LOADING = "Loading...",
  PLAY_AGAIN = " ↻ Play Again",

  // Sections
  FUN_FACT = "Fun Fact!",
  TRIVIA = "Trivia",

  // Challenge related
  CHALLENGE_MESSAGE = "I challenge you to beat my score in Globetrotter! {url}",
}

export enum ErrorMessages {
  CHALLENGE_CREATION_ERROR = "Error creating challenge:",
  INCORRECT_USER_LOGIN = "Login with the correct user",
  MISSING_CHALLENGE_ID = "Challenge ID is required",
  INTERNAL_SERVER_ERROR = "Internal server error",
}
