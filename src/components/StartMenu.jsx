import React from "react";

const StartMenu = ({ handleMultiplayer }) => {
  return (
    <div className="start-menu">
      <h1 className="title">Welcome To Chess</h1>
      <button
        className="`multiplayer-button"
        onClick={() => handleMultiplayer()}
      >
        <p data-title="Play Multiplayer" data-text="Start!"></p>
      </button>
      <button className="ai-button">
        <p data-title="Play vs AI" data-text="Start!"></p>
      </button>
    </div>
  );
};

export default StartMenu;
