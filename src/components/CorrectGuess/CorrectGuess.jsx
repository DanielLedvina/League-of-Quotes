import React, {useState, useEffect, useRef} from "react";
import "./CorrectGuess.css";
import ConfettiCanvas from "../ConfettiComponent/ConfettiComponent";
import config from "../../config/config";
const CheekyPoro = "/images/emotes/cheeky-poro.webp";
const FanPoro = "/images/emotes/fan-poro.webp";
const PeacePoro = "/images/emotes/peace-poro.webp";
const WP = "/images/emotes/wp.webp";

const images = [CheekyPoro, FanPoro, PeacePoro, WP];

const CorrectGuess = ({correctGuess}) => {
  const serverUrl = config.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);
  const [champion, setChampionGuessed] = useState(null);
  const [showBubble, setShowBubble] = useState(false); // New state for managing bubble visibility

  useEffect(() => {
    if (!correctGuess) {
      return setLoading(true);
    }
    setChampionGuessed(correctGuess?.champion);
    setShowBubble(true); // Show the bubble initially when the guess is correct

    // Timer to hide the bubble after 4 seconds

    setTimeout(() => {
      setLoading(false);
    }, 2300);
    setTimeout(() => {
      setShowBubble(false);
    }, 5000);
  }, [correctGuess]);

  const championNameLowerCase = String(champion).toLowerCase();
  if (!loading)
    return (
      <section className="correct-guess">
        <section className="guess-feedback-section">
          <div className="guess-congratulation">
            <img src={WP} alt="well-played" />
            <p className="guess-feedback">{`Correct! It's ${champion}!`}</p>
            <img src={CheekyPoro} alt="cheeky-poro" />
          </div>
          <sub>Click "New Quote" for another guess</sub>
          <br />
        </section>
        <div className="correct-guess-img-container">
          <div className="correct-guess-img-section">
            <img className="correct-guess-img" src={`${serverUrl}/images/champion-splashart/Original ${champion}.png`} alt={champion + " img"} />
            {showBubble && <div className="hover-bubble">Hover over me!</div>}
          </div>
          <div className="champion-links">
            <a className="champion-link" href={`https://leagueoflegends.fandom.com/wiki/${champion}/LoL`} target="_blank" rel="noreferrer">
              Wiki
            </a>
            <hr className="hr-link" />
            <a className="champion-link" href={`https://universe.leagueoflegends.com/en_US/story/champion/${champion}/`} target="_blank" rel="noreferrer">
              Story
            </a>
            <hr className="hr-link" />
            <a className="champion-link" href={`https://www.leagueofgraphs.com/champions/stats/${champion}`} target="_blank" rel="noreferrer">
              Stats
            </a>
            <hr className="hr-link" />
            <a className="champion-link" href={`https://u.gg/lol/champions/${champion}/build`} target="_blank" rel="noreferrer">
              Build
            </a>
            <hr className="hr-link" />
            <a className="champion-link" href={`https://www.leagueofgraphs.com/rankings/summoners/${championNameLowerCase}`} target="_blank" rel="noreferrer">
              TOP 100 {champion}'s players
            </a>
          </div>
        </div>

        <ConfettiCanvas isActive={correctGuess} images={images} />
      </section>
    );
};

export default CorrectGuess;
