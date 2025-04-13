export enum TextVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SUCCESS = "success",
  DANGER = "danger",
  INFO = "info",
}

export enum TextSize {
  XS = "xs",
  SM = "sm",
  BASE = "base",
  LG = "lg",
  XL = "xl",
  XXL = "2xl",
  XXXL = "3xl",
  XXXXL = "4xl",
}

export enum HeadingLevel {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  P = "p",
  SPAN = "span",
}

export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SUCCESS = "success",
  DANGER = "danger",
}

export enum ButtonSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum TextContent {
  // Game related
  GAME_TITLE = "GLOBETROTTER",
  SCORE_TEXT = "Score: {correct} correct, {incorrect} incorrect",
  NEXT_DESTINATION = "Next Question",
  CHALLENGE_FRIEND = "Challenge a Friend",
  LOADING = "Loading...",

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
