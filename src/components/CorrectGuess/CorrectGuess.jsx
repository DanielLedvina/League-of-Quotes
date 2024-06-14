import React from "react";
import "./CorrectGuess.css";

const CorrectGuess = ({ correctGuess, feedbackGuess }) => {
  if (!correctGuess) {
    return null;
  }

  const { champion, release, position, resource, rangeType, region } = correctGuess;

  return (
    <div className="correct-guess">
      <div className="guess-feedback">{feedbackGuess}</div>
      <p>Champion: {champion}</p>
      <p>Release Date: {release}</p>
      <p>Position: {position}</p>
      <p>Resource: {resource}</p>
      <p>Range Type: {rangeType}</p>
      <p>Region: {region}</p>
      <img className="correct-guess-img" src={`/images/champion-pfp/${champion}.png`} alt={champion + " img"} />
    </div>
  );
};

export default CorrectGuess;
