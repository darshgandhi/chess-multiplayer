import { useState, useEffect } from "react";
import "./styles/app.css";
import GameBoard from "./components/GameBoard";
import ScoreBoard from "./components/ScoreBoard";

function App() {
  const [bScore, setBScore] = useState(0);
  const [wScore, setWScore] = useState(0);
  return (
    <>
      <div className="main-div">
        <ScoreBoard bScore={bScore} wScore={wScore} />
        <div className="display-board">
          <GameBoard setBScore={setBScore} setWScore={setWScore} />
        </div>
      </div>
    </>
  );
}

export default App;
