import { useState, useEffect } from "react";
import "./styles/app.css";
import GameBoard from "./components/GameBoard";
import ScoreBoard from "./components/ScoreBoard";

function App() {
  const [score, setScore] = useState(0);
  return (
    <>
      <div className="main-div">
        <ScoreBoard bScore={score["black"]} wScore={score["white"]} />
        <GameBoard setScore={setScore} />
        <button className="multiplayer-button">
          <p data-title="Play Multiplayer" data-text="Start!"></p>
        </button>
        <button className="ai-button">
          <p data-title="Play vs AI" data-text="Start!"></p>
        </button>
        <button className="minimax-button">
          <p data-title="Minimax Mode" data-text="Start!"></p>
        </button>
        <button className="resign-button">
          <p data-title="Resign" data-text="Resign :("></p>
        </button>
      </div>
    </>
  );
}

export default App;
