import { useState, ChangeEvent, KeyboardEvent } from "react";
import { transliterate } from "transliteration";

const Transliteration = () => {
  const [inputString, setInputString] = useState("");
  const [strings, setStrings] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputString(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      handleButtonClick();
    }
  };

  const handleButtonClick = () => {
    const newStrings = inputString
      .split("\n")
      .map((str) => str.trim().toLowerCase());
    setStrings(newStrings);
    setInputString("");
  };
  return (
    <>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Транслитериция
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
        }}
      >
        <textarea
          value={inputString}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleButtonClick}>Транслитерировать</button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {strings.map((str, index) => {
          const replacedStr = str.replace(/\s/g, "_");
          const transliteratedStr = transliterate(replacedStr);
          return <h3 key={index}>{transliteratedStr}</h3>;
        })}
      </div>
    </>
  );
};

export default Transliteration;
