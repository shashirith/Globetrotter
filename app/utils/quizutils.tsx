import { ButtonVariant } from "../enums";
import { Destination } from "../types/utils";
import { v4 as uuidv4 } from "uuid";
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

export const api = async (path: string, options: RequestInit = {}) => {
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

export const getButtonVariant = (
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
