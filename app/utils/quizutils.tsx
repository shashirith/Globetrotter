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
  if (option === `${destination?.name}, ${destination?.country}`) {
    return ButtonVariant.SUCCESS;
  }
  if (option === selectedAnswer) {
    return ButtonVariant.DANGER;
  }
  return ButtonVariant.SECONDARY;
};

export const images = [
  "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg", // Paris
  "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg", // New York City
  "https://images.pexels.com/photos/50632/pexels-photo-50632.jpeg", // London
  "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg", // Tokyo
  "https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg", // Sydney
  "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg", // Rome
  "https://images.pexels.com/photos/1619311/pexels-photo-1619311.jpeg", // Berlin
  "https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg", // Dubai
  "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg", // Toronto
  "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg", // San Francisco
];

export const getRandomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};
