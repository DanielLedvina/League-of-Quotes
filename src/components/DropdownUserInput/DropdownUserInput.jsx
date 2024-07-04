import React, {useState, useRef} from "react";
import "./DropdownUserInput.css";
import {useAppContext} from "../../context/AppContext"; // Import the context
import config from "../../config/config";

const DropdownUserInput = ({onGuess, disabled, championGuessed, guessedChampions}) => {
  const {champions, loading} = useAppContext(); // Use context to get champions and loading
  const [input, setInput] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const serverUrl = config.REACT_APP_API_URL;

  // Filter out guessed champions
  const names = champions ? Object.keys(champions).filter((name) => !championGuessed.includes(name)) : [];

  const handleInputChange = (e) => {
    if (loading) return;
    const value = e.target.value;
    const upperCase = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setInput(upperCase);
    if (!upperCase) {
      setFilteredNames([]);
      setSelectedIndex(-1);
      return;
    }
    const filtered = names.filter((name) => name.toLowerCase().startsWith(upperCase.toLowerCase()));
    setFilteredNames(filtered);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 40:
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredNames.length - 1 ? prev + 1 : prev));
        break;
      case 38:
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 13:
        e.preventDefault();
        submitGuess();
        break;
      default:
        break;
    }
  };

  const submitGuess = () => {
    if (loading) return;
    let guess = input;

    if (selectedIndex >= 0 && filteredNames[selectedIndex]) {
      guess = filteredNames[selectedIndex];
    }

    const isCorrectGuess = names.includes(guess);
    onGuess(guess);

    if (isCorrectGuess) {
      setInput("");
      setFilteredNames([]);
      setSelectedIndex(-1);
    } else {
      setFilteredNames(names.filter((name) => name.toLowerCase().startsWith(input.toLowerCase())));
    }

    inputRef.current.blur();
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    setFilteredNames([]);
    setInput("");
  };

  const handleInputFocus = () => {
    if (loading) return;
    setIsFocused(true);
    if (input === "") {
      setFilteredNames(names);
      setSelectedIndex(-1);
    } else {
      setFilteredNames(names.filter((name) => name.toLowerCase().startsWith(input.toLowerCase())));
    }
  };

  const handleListItemClick = (name) => {
    setInput(name);
    setFilteredNames([]);
    setSelectedIndex(-1);
    onGuess(name);
    setInput("");

    inputRef.current.blur();
  };

  return (
    <section className="champion-find">
      <input className="champion-input" type="text" value={input} onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} onKeyDown={handleKeyDown} placeholder="Enter champion name" disabled={disabled} ref={inputRef} />
      {isFocused && filteredNames.length > 0 ? (
        <ul className="filtered-names">
          {filteredNames.slice(0, 4).map((name, index) => (
            <li className="champion-select" key={name} onMouseDown={(e) => e.preventDefault()} onClick={() => handleListItemClick(name)} onMouseEnter={() => setSelectedIndex(index)} style={{backgroundColor: index === selectedIndex ? "#7f7f7f" : "transparent"}} ref={guessedChampions}>
              <img className="champion-select-img" src={`${serverUrl}/images/champion-pfp/${name}.png`} alt={name + " img"} loading="lazy" />
              <p className="champion-select-name">{name}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

export default DropdownUserInput;
