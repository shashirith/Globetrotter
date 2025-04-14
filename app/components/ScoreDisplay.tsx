import React from "react";

interface ScoreDisplayProps {
  score: number;
  total: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, total }) => {
  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
      <div
        className="absolute inset-0 rounded-full border-4 border-blue-500"
        style={{
          clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-700">
          {score}/{total}
        </span>
      </div>
    </div>
  );
};

export default ScoreDisplay;
