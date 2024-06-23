import React from "react";
import "./CorrectGuess.css";
import ConfettiCanvas from "../ConfettiComponent/ConfettiComponent";
const CheekyPoro = "/images/emotes/Cheeky_poro.webp";
const FanPoro = "/images/emotes/Fan_poro.webp";
const PeacePoro = "/images/emotes/Peace_poro.webp";
const WP = "/images/emotes/WP.webp";

const images = [CheekyPoro, FanPoro, PeacePoro, WP];

const CorrectGuess = ({correctGuess, feedbackGuess}) => {
  const serverUrl = process.env.REACT_APP_API_URL;
  if (!correctGuess) {
    return null;
  }

  const {champion, release, position, resource, rangeType, region} = correctGuess;

  return (
    <section className="correct-guess">
      <ConfettiCanvas isActive={true} images={images} />
      <div className="guess-feedback">{feedbackGuess}</div>
      <img className="correct-guess-img" src={`${serverUrl}/images/champion-splashart/Original ${champion}.png`} alt={champion + " img"} />
      <section className="champion-atributes">
        <p>Champion: {champion}</p>
        <p>Release Date: {release}</p>
        <p>Position: {position}</p>
        <p>Resource: {resource}</p>
        <p>Range Type: {rangeType}</p>
        <p>Region: {region}</p>
      </section>
    </section>
  );
};

export default CorrectGuess;
