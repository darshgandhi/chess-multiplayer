import React from "react";

const GameOver = ({ handleStartGame }) => {
  return (
    <div className="gameover">
      <h2 className="title">Game Over</h2>
      <button className="pa-button" onClick={handleStartGame}>
        Play Again
      </button>
      <button className="exit-button">Exit</button>
    </div>
  );
};

export default GameOver;
