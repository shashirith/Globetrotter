![image](https://github.com/user-attachments/assets/717ae933-ccec-43d8-9617-150740577189)

# Globetrotter – The Ultimate Travel Guessing Game! 🌍

## Table of Contents

- [About](#about)
- [Requirements](#requirements-added)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Repository Structure](#repository-structure)
- [Components](#components)
  **need to add this**
- [Video Demo](#video-demo)
- [Special Thanks](#conclusion)

---

## About

**Globetrotter** is a full-stack web app where users are given cryptic clues about famous global destinations and must guess which one it is! Whether you're a geography buff or just in for some fun, Globetrotter combines trivia, guessing, and delightful surprises in an interactive travel challenge.

Built With

## Technology Choices

### Next.js

We chose Next.js for this project because it provides a robust framework for building server-rendered React applications. It offers features like automatic code splitting, server-side rendering, and static site generation, which enhance performance and SEO.

### next/font

The `next/font` package is used to optimize and load fonts efficiently. It helps in reducing the page load time by automatically optimizing font loading, which is crucial for maintaining a good user experience.

### Vercel

Vercel is used for deployment because it offers seamless integration with Next.js, providing features like automatic deployments, serverless functions, and a global CDN. This ensures that our application is fast and reliable for users worldwide.

### dotenv

The [dotenv](https://github.com/motdotla/dotenv) library is used to load environment variables from a `.env` file into `process.env`, which is essential for managing configuration settings securely.

---

# My Info

<table>
  <tr>
    <td>
      <a href="https://drive.google.com/file/d/1J49hQ45HZ0mY3qP1wEC3HV9WHR1mok7H/view" target="_blank">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOl2kXSlxZXOy47YWmfhEBW3q_xrUaQPISgw&usqp=CAU" alt="shashirith" style="width: 30px; height: 30px; border-radius: 50%;">
      </a>
    </td>
    <td style="vertical-align: middle;">Resume</td>
  </tr>
</table>

## Requirements Added

### 1️⃣ Dataset & AI Integration

- Includes a curated starter dataset of famous global destinations.
- Enhanced using AI tools (e.g., ChatGPT, OpenAI API, or web scraping) to scale up to **100+ destinations**.
- Each destination includes:
  - Cryptic clues
  - Fun facts
  - Trivia

### 2️⃣ Functional Web Application

- ✅ Show **1–2 random clues** per destination.
- ✅ Present **multiple choice answers** for user selection.
- ✅ Immediate response with animations:
  - 🎉 **Correct Guess** → Confetti animation + reveal fun fact.
  - 😢 **Incorrect Guess** → Sad-face animation + reveal fun fact.
- ✅ Scoreboard to track correct/incorrect answers.
- ✅ **“Play Again” / “Next”** button for a new random round.
- ✅ Backend-driven data – no client-side leaks 🙈

### 3️⃣ “Challenge a Friend” Feature

- ✅ Users enter a **unique username** to register and create a profile.
- ✅ Clicking **"Challenge a Friend"**:
- ✅ Friends can **see your score** before playing.
- ✅ Anyone with the link can **fully access** the game experience.

---

## Features

- 🔍 Guess destinations using clever clues.
- 🎨 Instant animated feedback with fun facts.
- 🧠 Score tracking for every game session.
- 🤝 Challenge & compete with friends.
- 💾 Backend-secure dataset.

---

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Getting Started

### Prerequisites

- Install [Node.js](https://nodejs.org/)

---

## Installation

```bash
git clone https://github.com/shashirith/globetrotter.git
cd globetrotter
yarn
yarn dev
```

## API Endpoints

This document provides an overview of the API endpoints available in the `app/api` directory. Each endpoint is designed to handle specific functionalities related to challenges, user history, and destinations.

## Endpoints

### 1. Challenge Endpoints

#### GET `/api/challenge`

- **Description**: Retrieves a specific challenge based on the `challengeId` and `username` provided in the request.
- **Headers**:
  - `username`: The username of the requester.
- **Query Parameters**:
  - `id`: The ID of the challenge to retrieve.
- **Response**:
  - Returns the `gameId` associated with the challenge if found.
  - Returns an error if the `challengeId` is missing or if the challenge is not found.

#### POST `/api/challenge`

- **Description**: Creates a new challenge or updates an existing one.
- **Headers**:
  - `username`: The username of the requester.
  - `game_id`: The ID of the game.
- **Request Body**:
  - `friendName`: The name of the friend to challenge.
- **Response**:
  - Returns a `shareUrl` for the newly created challenge.
  - Returns an error if required fields are missing.

### 2. User History Endpoint

#### GET `/api/userhistory`

- **Description**: Retrieves the user's game history, including the number of correct and incorrect answers.
- **Headers**:
  - `username`: The username of the requester.
  - `game_id`: The ID of the game.
- **Response**:
  - Returns the count of correct and incorrect answers along with the total number of attempts.

### 3. Destinations Endpoints

#### POST `/api/destinations`

- **Description**: Validates the user's answer for a destination clue and records the result.
- **Headers**:
  - `username`: The username of the requester (or `Anonymous` if not provided).
  - `game_id`: The ID of the game.
- **Request Body**:
  - `id`: The ID of the destination.
  - `selectedAnswer`: The answer selected by the user.
- **Response**:
  - Returns whether the answer is correct, the correct answer, and the destination details.
  - Records the result in the user's history if the user is not anonymous.

#### GET `/api/destinations`

- **Description**: Retrieves the next destination question for the user.
- **Headers**:
  - `username`: The username of the requester (or `Anonymous` if not provided).
  - `game_id`: The ID of the game.
  - `is_challenge`: Indicates if the request is part of a challenge.
- **Response**:
  - Returns the next destination question and multiple-choice options.
  - Returns an error if no more questions are available in a challenge.

## Repository Structure

```sh
└── globetrotter/
    ├── .env
    ├── .gitignore
    ├── README.md
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── yarn.lock
    ├── app/
    │   ├── api/
    │   │   ├── challenge/
    │   │   │   ├── getHandler.ts
    │   │   │   ├── postHandler.ts
    │   │   │   └── route.ts
    │   │   ├── destinations/
    │   │   │   └── route.ts
    │   │   ├── userhistory/
    │   │   │   └── route.ts
    │   │   └── utils.ts
    │   ├── challenge/
    │   │   └── [id]/
    │   │       └── page.tsx
    │   ├── components/
    │   │   ├── Quiz/
    │   │   │   └── index.tsx
    │   │   ├── ChallengeModal.tsx
    │   │   ├── MotionButton.tsx
    │   │   ├── MotionDiv.tsx
    │   │   ├── SadFaceAnimation.tsx
    │   │   ├── ScoreDisplay.tsx
    │   │   └── Text.tsx
    │   ├── enums/
    │   │   ├── apienums.ts
    │   │   ├── button.ts
    │   │   ├── index.ts
    │   │   └── text.ts
    │   ├── lib/
    │   │   ├── destinations.ts
    │   │   └── mongodb.ts
    │   ├── types/
    │   │   └── utils.ts
    │   ├── utils/
    │   │   └── quizutils.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── node_modules/
    └── public/

```

## Components

### ChallengeModal.tsx

- **Description**: This component likely represents a modal dialog used to present challenges or tasks to the user. It may include features such as displaying challenge details, accepting user input, and providing options to accept or decline the challenge.
- **Features**:
  - Displays challenge information in a modal format.
  - Includes interactive elements for user engagement.
  - May support animations or transitions for a smooth user experience.

### Text.tsx

- **Description**: This component is probably used for rendering text elements within the application. It might provide styling and formatting options to ensure consistency across different text displays.
- **Features**:
  - Supports various text styles and formats.
  - Can be customized for different text sizes and colors.
  - Ensures consistent typography throughout the application.

### ScoreDisplay.tsx

- **Description**: This component is likely responsible for displaying the user's score or progress. It might be used in gaming or quiz contexts to provide feedback on performance.
- **Features**:
  - Displays numerical scores or progress indicators.
  - May include visual enhancements like animations or color changes based on score.
  - Can be integrated into dashboards or result screens.

### MotionButton.tsx

- **Description**: This component probably represents a button with motion or animation effects. It might be used to enhance user interaction by providing visual feedback when the button is clicked or hovered over.
- **Features**:
  - Includes motion effects for interactive feedback.
  - Customizable button styles and animations.
  - Supports various button states (e.g., active, disabled).

### MotionDiv.tsx

- **Description**: This component likely provides a div container with motion or animation capabilities. It can be used to wrap other elements and apply motion effects to them.
- **Features**:
  - Adds motion effects to contained elements.
  - Supports various animation types and durations.
  - Can be used to enhance the visual appeal of static content.

### SadFaceAnimation.tsx

- **Description**: This component probably renders an animated sad face, which might be used to indicate errors, failures, or negative outcomes in the application.
- **Features**:
  - Displays an animated sad face icon.
  - Can be used to convey negative feedback or error states.
  - Supports customization of animation speed and style.

## Official Resources

- **[Next.js Documentation](https://nextjs.org/docs)**: Comprehensive guidance on using Next.js, a React framework for production.

- **[Next.js GitHub Repository](https://github.com/vercel/next.js)**: Find the source code, report issues, and contribute to the development of Next.js.

- **[Vercel Platform](https://vercel.com/docs)**: Learn about deploying applications with Vercel, the platform for frontend frameworks and static sites.

- **[dotenv GitHub Repository](https://github.com/motdotla/dotenv)**: Learn about dotenv, a module to load environment variables from a `.env` file.

## About the Assignment

The Globetrotter challenge offered a unique and exciting opportunity to build an interactive, full-stack web application. This project pushed me to explore innovative features, from AI-assisted data generation to game mechanics and user engagement flows. It was both a creative and technical journey that helped me grow significantly as a developer.

## Key Takeaways

Working on Globetrotter has been a deeply enriching experience. Here are some of the most valuable lessons and skills I gained:

- **AI Integration & Dataset Expansion**: I learned to creatively use AI tools to scale a dataset from a few destinations to 100+ entries, complete with clues, fun facts, and trivia.
- **Front-End Mastery with Next.js and React**: The assignment helped me sharpen my React and Next.js skills, building a fast and responsive interface for users.
- **Interactive Gameplay Features**: Implementing real-time feedback with animations (confetti, sad-face), tracking scores, and ensuring smooth state transitions was a great learning curve.
- **Backend Security & API Management**: I ensured that the dataset and logic were securely stored and retrieved through backend APIs, preventing any frontend exposure.
- **User Engagement with Social Sharing**: Building the “Challenge a Friend” feature taught me the importance of user-centric design, dynamic links, and engaging UX.

## Conclusion

This assignment was not just a coding task—it was an exploration of creativity, problem-solving, and thoughtful user experience design. I'm proud of what I built and even more excited about the learnings I've taken away.

A heartfelt thank you to the **Headout** team for presenting such a well-rounded and stimulating challenge. It’s been an absolute pleasure working on Globetrotter, and I look forward to more such collaborative opportunities in the future.
