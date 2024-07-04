import React from "react";
import "./HintBox.css";
import config from "../../config/config";

const HintBox = ({guessedChampion = {}, realChampion = {}}) => {
  const championProp = [{key: "champion", type: "image"}, {key: "release"}, {key: "position"}, {key: "resource"}, {key: "rangeType"}, {key: "region"}];
  const rightGuessColor = "#0397AB";
  const falseGuessColor = "#1E2328";
  const championImgBg = "black";
  const serverUrl = config.REACT_APP_API_URL;

  return (
    <section className="champion-hint-box">
      <section className="champion-hint-values">
        {championProp.map((prop, index) => (
          <div
            className="hint-value"
            key={prop.key}
            style={{
              backgroundColor: prop.type !== "image" && guessedChampion[prop.key] === realChampion[prop.key] ? rightGuessColor : prop.type !== "image" ? falseGuessColor : championImgBg,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            {prop.type === "image" ? (
              <>
                <img src={`${serverUrl}/images/champion-pfp/${guessedChampion.champion || "default"}.png`} className="champion-img" alt={guessedChampion.champion} />
                <span className="tooltip-img">{guessedChampion.champion}</span>
              </>
            ) : (
              <p className="champion-atribute">{guessedChampion[prop.key]}</p>
            )}
          </div>
        ))}
      </section>
    </section>
  );
};

export default HintBox;
