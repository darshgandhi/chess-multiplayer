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
        <div className="display-board">
          <GameBoard setScore={setScore} />
        </div>
      </div>
    </>
  );
}

export default App;
