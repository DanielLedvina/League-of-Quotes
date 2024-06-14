import React from "react";
import "./HintBox.css";

export default function HintBox({quessedChampion = {}, realChampion = {}}) {
  const championProp = [{key: "champion", type: "image"}, {key: "release"}, {key: "position"}, {key: "resource"}, {key: "rangeType"}, {key: "region"}];
  const rightGuessColor = "#6a940e"; //#005A82 #6a940e
  const falseGuessColor = "#1E2328"; // #1E2328 #9c312b
  return (
    <div className='champion-hint-box'>
      <div className='champion-hint-values'>
        {championProp.map((prop) => (
          <div
            className='hint-value'
            key={prop.key}
            style={{
              backgroundColor: prop.type !== "image" && quessedChampion[prop.key] === realChampion[prop.key] ? rightGuessColor : prop.type !== "image" ? falseGuessColor : "transparent",
            }}
          >
            {prop.type === "image" ? <img src={`images/champion-pfp/${quessedChampion.champion || "default"}.png`} alt={quessedChampion.champion} style={{width: "50px", height: "50px"}} /> : quessedChampion[prop.key]}
          </div>
        ))}
      </div>
    </div>
  );
}
