import React, {useState, useEffect, useRef} from "react";
import {DropdownUserInput, HintBox, CorrectGuess, Header} from "../components";
import "./Main.css";
import debounce from "lodash/debounce";
import {useAppContext} from "../context/AppContext"; // Import the context

const Main = () => {
  const {champions, loading} = useAppContext(); // Use context to get champions and loading
  const [quoteData, setQuoteData] = useState({
    champion: "",
    quote: "",
    release: "",
    position: "",
    resource: "",
    rangeType: "",
    region: "",
    image: "",
  });
  const [feedback, setFeedback] = useState("");
  const [hintBoxesData, setHintBoxesData] = useState([]);
  const [correctGuess, setCorrectGuess] = useState(null);
  const quoteRef = useRef(null);
  const quoteContainerRef = useRef(null);
  const [championGuessed, setChampionGuessed] = useState([]);
  const correctGuessRef = useRef(null);

  useEffect(() => {
    if (correctGuess !== null) {
      setTimeout(() => {
        const element = document.querySelector(".correct-guess");
        if (element) {
          element.scrollIntoView({behavior: "smooth", block: "end"});
        }
      }, 1000);
    }
  }, [correctGuess]);

  const hintHeadingProp = [{text: "Champion"}, {text: "Release date"}, {text: "Position"}, {text: "Resource"}, {text: "Range type"}, {text: "Region"}];

  useEffect(() => {
    if (!loading) {
      setQuoteData(getRandomChampionAndQuote());
      resizeText({
        element: document.querySelector(".champion-quote"),
        parent: document.querySelector(".champion-random-quote-section"),
      });
    }
  }, [loading]);

  useEffect(() => {
    const handleResize = debounce(() => {
      if (quoteRef.current && quoteContainerRef.current) {
        resizeText({element: quoteRef.current, parent: quoteContainerRef.current});
      }
    }, 50);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [quoteData]);

  function getRandomChampionAndQuote() {
    if (loading || !champions) return {champion: "No champions available", quote: "No quotes available."};
    const championKeys = Object.keys(champions);

    if (championKeys.length === 0) return {champion: "No champions available", quote: "No quotes available."};

    const selectedChampion = championKeys[Math.floor(Math.random() * championKeys.length)];
    const championData = champions[selectedChampion];

    if (championData.quotes && championData.quotes.length > 0) {
      const {quotes, release, position, resource, rangeType, region, image} = championData;
      return {
        champion: selectedChampion,
        quote: quotes[Math.floor(Math.random() * quotes.length)],
        release,
        position,
        resource,
        rangeType,
        region,
        image,
      };
    } else return {champion: selectedChampion, quote: "No quotes available for this champion."};
  }

  const isOverflown = (element) => element.scrollHeight > element.clientHeight;

  const resizeText = ({element, parent}) => {
    if (!element || !parent) {
      console.error("Element or parent not found!");
      return; // Exit the function if element or parent is null
    }
    if (loading) return;
    let maxFontSize;

    if (window.innerWidth <= 497) {
      maxFontSize = 1.5;
    } else if (window.innerWidth <= 600) {
      maxFontSize = 2;
    } else {
      maxFontSize = 2.8; // Default max font size for larger screens
    }

    let i = 0.5;
    let overflow = false;

    while (!overflow && i < maxFontSize) {
      element.style.fontSize = `${i}rem`;
      overflow = isOverflown(parent);
      if (!overflow) i += 0.1; // Increment by 0.1rem
    }
    element.style.fontSize = `${i - 0.1}rem`; // Set to last non-overflowing size
  };

  function handleGuess(userInput) {
    if (loading) return;

    const formattedInput = userInput.charAt(0).toUpperCase() + userInput.slice(1).toLowerCase();
    const guessedChampion = champions[formattedInput];
    if (guessedChampion) {
      const {release, position, resource, rangeType, region, image} = guessedChampion;
      if (formattedInput.toLowerCase() === quoteData.champion.toLowerCase()) {
        setCorrectGuess({
          champion: formattedInput,
          release,
          position,
          resource,
          rangeType,
          region,
          image,
        });

        setFeedback("Correct! Well played. Try the next one!");
        setChampionGuessed([]); // Reset guessed champions on correct guess
      } else {
        const guessedChampionObj = {
          champion: formattedInput,
          release,
          position,
          resource,
          rangeType,
          region,
          image,
        };

        const realChampion = quoteData;

        setHintBoxesData(hintBoxesData.concat({quessedChampion: guessedChampionObj, realChampion}));
        setChampionGuessed([...championGuessed, formattedInput]); // Add wrong guess to the list
      }
    } else {
      setFeedback("Champion not found. Please try again.");
    }
  }

  function startNewGuess() {
    setCorrectGuess(null);
    setHintBoxesData([]);
    setQuoteData(getRandomChampionAndQuote());
    setFeedback("");
    setChampionGuessed([]);
  }

  return (
    <div className="App">
      <Header />
      {!loading && champions && (
        <section className="champion-guesser">
          <section className="champion-random-quote-section" ref={quoteContainerRef}>
            <p className="champion-quote" ref={quoteRef}>
              {quoteData?.quote}
            </p>
          </section>
          <section className="champion-input-section">
            <DropdownUserInput onGuess={handleGuess} disabled={!!correctGuess} championGuessed={championGuessed} />
            <button className="champion-new-guess-button" onClick={startNewGuess}>
              New Quote
            </button>
          </section>
          <CorrectGuess correctGuess={correctGuess} feedbackGuess={feedback} ref={correctGuessRef} />
          <section className="hint-box-section">
            {hintBoxesData.length > 0 && (
              <section className="champion-hint-headings">
                {hintHeadingProp.map((prop) => (
                  <>
                    <div className="hint-heding-values">
                      <p className="hint-heading" key={prop.text}>
                        {prop.text}
                      </p>
                      <hr />
                    </div>
                  </>
                ))}
              </section>
            )}
            {hintBoxesData.map(({quessedChampion, realChampion}, index) => (
              <HintBox key={index} quessedChampion={quessedChampion} realChampion={realChampion} />
            ))}
          </section>
        </section>
      )}
    </div>
  );
};

export default Main;
