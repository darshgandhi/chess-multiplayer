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
    localScore,
    localFen,
  });

  const handleStartGame = () => {
    setShowPlayAgain(true);
    setGameRunning(true);
    setGameOver(false);
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

  useEffect(() => {
    if (
      localScore["white"] !== serverScore["white"] ||
      localScore["black"] !== serverScore["black"]
    ) {
      //console.log(localScore != serverScore);
      //console.log(localScore, serverScore);
    }
  }, [localScore, serverScore]);

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
          ref={gameBoardRef}
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
