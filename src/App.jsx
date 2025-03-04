import { useState, useEffect, useRef } from "react";
import GameBoard from "./components/GameBoard";
import StartMenu from "./components/StartMenu";
import FindingGame from "./components/FindingGame";
import useMultiplayer from "./hooks/useMultiplayer.js";
import "./styles/app.css";

function App() {
  const [gameRunning, setGameRunning] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [playerResign, setPlayerResign] = useState(false);
  const [localScore, setLocalScore] = useState("");
  const [localFen, setLocalFen] = useState("");
  const [endReason, setEndReason] = useState(null);
  const [winReason, setWinReason] = useState(null);

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
    socket,
    setOpponentName,
  } = useMultiplayer({
    localScore,
    localFen,
    playerResign,
    winReason,
    setOpponentDisconnected,
    setEndReason,
    setLocalScore,
  });

  const handleStartGame = () => {
    setGameRunning(true);
    if (gameBoardRef.current) {
      gameBoardRef.current.resetGame();
    }
  };

  const handleResign = () => {
    setPlayerResign(true);
    setEndReason({ reason: "You Resigned", message: "You Lose :(" });
  };

  const handleExit = () => {
    setOpponentName(null);
    setOpponentDisconnected(true);
    setLocalScore("");
    setLocalFen("");
    setEndReason(null);
    setWinReason(null);
    setGameRunning(false);
    setOpponentDisconnected(false);
    setPlayerResign(false);
    gameBoardRef.current.resetGame();
    socket.close();
  };

  useEffect(() => {
    if (playOnline) {
      handleStartGame();
    }
  }, [playOnline]);

  return (
    <>
      {/* Pre Game Menus */}
      {!gameRunning && <StartMenu handleMultiplayer={handleMultiplayer} />}
      {playOnline && !opponentName && !opponentDisconnected && socket && (
        <FindingGame />
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
          endReason={endReason}
          setLocalScore={setLocalScore}
          setLocalFen={setLocalFen}
          handleResign={handleResign}
          handleExit={handleExit}
          setWinReason={setWinReason}
        />
      )}
    </>
  );
}

export default App;
