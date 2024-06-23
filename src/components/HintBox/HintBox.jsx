import React from "react";
import "./HintBox.css";

export default function HintBox({quessedChampion = {}, realChampion = {}}) {
  const championProp = [{key: "champion", type: "image"}, {key: "release"}, {key: "position"}, {key: "resource"}, {key: "rangeType"}, {key: "region"}];
  const rightGuessColor = "#0397AB"; //#005A82(BLUE 4) #6a940e #0397AB(BLUE 3)
  const falseGuessColor = "#1E2328"; // #1E2328(grey 3) #9c312b
  const championImgBg = "black";
  const serverUrl = process.env.REACT_APP_API_URL;

  return (
    <section className="champion-hint-box">
      <section className="champion-hint-values">
        {championProp.map((prop) => (
          <div
            className="hint-value"
            key={prop.key}
            style={{
              backgroundColor: prop.type !== "image" && quessedChampion[prop.key] === realChampion[prop.key] ? rightGuessColor : prop.type !== "image" ? falseGuessColor : championImgBg,
            }}
          >
            {prop.type === "image" ? (
              <>
                <img src={`${serverUrl}/images/champion-pfp/${quessedChampion.champion || "default"}.png`} className="champion-img" alt={quessedChampion.champion} />
                <span className="tooltip-img">{quessedChampion.champion}</span>
              </>
            ) : (
              <p className="champion-atribute">{quessedChampion[prop.key]}</p>
            )}
          </div>
        ))}
      </section>
    </section>
  );
}
