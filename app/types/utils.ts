export interface Challenge {
  user_name: string;
  friend_name: string;
  game_id: string;
  challenge_id: string;
  createdAt?: number;
}

export interface Destination {
  id: number;
  name: string;
  country: string;
  clues: string[];
  funFacts: string[];
  trivia: string[];
}

export interface UserHistory {
  user_name: string;
  game_id: string;
  destination_id: number;
  date: Date;
  is_correct: boolean;
}

export interface GetNextQuestionIndexProps {
  name: string;
  isChallenge: string;
  gameId: string;
}
