import { useState, useEffect, useRef } from "react";
import GameBoard from "./components/GameBoard";
import StartMenu from "./components/StartMenu";
import FindingGame from "./components/FindingGame";
import GameOver from "./components/GameOver";
import useMultiplayer from "./hooks/useMultiplayer.js";
import "./styles/app.css";

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(true);
  const [localScore, setLocalScore] = useState("");
  const [localFen, setLocalFen] = useState("");

  const gameBoardRef = useRef(null);

  const {
    handleMultiplayer,
    serverScore,
    serverFen,
    playerColor,
    playerName,
    opponentName,
    currentTurn,
    playOnline,
  } = useMultiplayer({
    localFen,
    localScore,
  });

  const handleStartGame = () => {
    setShowPlayAgain(true);
    setGameRunning(true);
    setGameOver(false);
    setScore({ white: 0, black: 0 });
    if (gameBoardRef.current) {
      gameBoardRef.current.resetGame();
    }
  };

  useEffect(() => {
    if (gameOver) {
      setGameRunning(false);
    }
  }, [gameOver]);

  useEffect(() => {
    if (playOnline) {
      handleStartGame();
    }
  }, [playOnline]);

  return (
    <>
      {/* Pre Game Menus */}
      {!gameRunning && <StartMenu handleMultiplayer={handleMultiplayer} />}
      {playOnline && !opponentName && <FindingGame />}

      {/* Game Over Menu */}
      {gameOver && showPlayAgain && (
        <GameOver handleStartGame={handleStartGame} />
      )}

      {/* Show Only When Game is Running */}
      {gameRunning && opponentName && (
        <GameBoard
          playerName={playerName}
          opponentName={opponentName}
          playerColor={playerColor}
          serverFen={serverFen}
          serverScore={serverScore}
          currentTurn={currentTurn}
          setLocalScore={setLocalScore}
          setLocalFen={setLocalFen}
          setGameOver={setGameOver}
        />
      )}
    </>
  );
}

export default App;
