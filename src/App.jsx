import { useState, useEffect, useRef } from "react";
import "./styles/app.css";
import Swal from "sweetalert2";
import GameBoard from "./components/GameBoard";
import ScoreBoard from "./components/ScoreBoard";
import { io } from "socket.io-client";

function App() {
  const [score, setScore] = useState({ white: 0, black: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(true);

  const [socket, setSocket] = useState(null);
  const [playOnline, setPlayOnline] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [localFen, setLocalFen] = useState("");
  const [serverFen, setServerFen] = useState("");

  const gameBoardRef = useRef(null);

  const handleStartGame = () => {
    setShowPlayAgain(true);
    setGameRunning(true);
    setGameOver(false);
    setScore({ white: 0, black: 0 });
    if (gameBoardRef.current) {
      gameBoardRef.current.resetGame();
    }
  };


  async function handleMultiplayer() {
    const result = await getPlayerName();
    if (!result.isConfirmed) return;
    const newSocket = io('http://localhost:3000', { autoConnect: true });
    setPlayerName(result.value);
    newSocket?.emit("request_to_play", { name: result.value });
    setSocket(newSocket);
  };

  const handleResign = () => {
    setGameOver(true);
    setGameRunning(false);
  };

  const handleExit = () => {
    setGameOver(true);
    setGameRunning(false);
    setShowPlayAgain(false);
  };

  useEffect(() => {
    if (gameOver) {
      setGameRunning(false);
    }
  }, [gameOver]);

  const getPlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter A Name:",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You must enter a name to play.";
        }
      }
    });
    return result;
  };

  useEffect(() => {
    if (playOnline) {
      handleStartGame();
    }
  }, [playOnline]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        setPlayOnline(true);
      });

      socket.on("waiting_for_opponent", () => {
        setOpponentName(null);
      });

      socket.on("found_opponent", (data) => {
        setOpponentName(data.opponentName);
        setPlayerColor(data.color);
      });

      socket.on("disconnect", () => {
        setPlayOnline(false);
        setOpponentName(null);
      });

      socket.on("get_server_state", (data) => {
        setServerFen(data.localFen);
        setScore(data.score);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (localFen) {
      socket?.emit("update_game", { localFen: localFen, score: score });
    }
  }, [localFen]);

  useEffect(() => {
    if (serverFen) {
      console.log("Server Fen: ", serverFen);
      setCurrentTurn(serverFen.split(" ")[1]);
      }
  }, [serverFen]);

  return (
    <>
      {/* Show Start Menu */}
      {!gameRunning && (
        <div className={`start-menu ${playOnline ? 'hidden' : 'visible'}`}>
          <h1 className="title">Welcome To Chess</h1>
          <button className={`multiplayer-button ${gameRunning ? "disabled" : ""}`} onClick={handleMultiplayer} disabled={gameRunning}>
            <p data-title="Play Multiplayer" data-text="Start!"></p>
          </button>
          <button className={`ai-button ${gameRunning ? "disabled" : ""}`} disabled={gameRunning}>
            <p data-title="Play vs AI" data-text="Start!"></p>
          </button>
        </div>
      )}

      {/* Show Only When Waiting for Opponent */}
      {playOnline && !opponentName && (
        <div className="waiting-menu">
          <h1 className="title">Finding Opponent</h1>
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      {/* Show Game Over Menu */}
      {gameOver && showPlayAgain && (
        <div className="gameover">
          <h2 className="title">Game Over</h2>
          <button className="pa-button" onClick={handleStartGame}>Play Again</button>
          <button className="exit-button" onClick={handleExit}>Exit</button>
        </div>
      )}

      {/* Show Only When Game is Running */}
      {gameRunning && opponentName && (
        <div className="main-div">
          <ScoreBoard bScore={score["black"]} wScore={score["white"]} p1={playerColor === "w" ? playerName : opponentName} p2={playerColor === "b" ? playerName : opponentName} />
          <GameBoard ref={gameBoardRef} setScore={setScore} setGameOver={setGameOver} startGame={gameRunning} setLocalFen={setLocalFen} server_fen={serverFen} playerColor={playerColor} serverScore={score} />
          <button className={`resign-button ${!gameRunning ? "disabled" : ""}`} onClick={handleResign} disabled={!gameRunning}>
            <p data-title="Resign" data-text="Resign :("></p>
          </button>
          <div className={`player ${currentTurn === playerColor ? ('turn' + (playerColor === "b" ? 'Black' : 'White')) : ''}`}>You: {playerName}</div>
          <div className={`opponent ${currentTurn !== playerColor ? ('turn' + (playerColor !== "b" ? 'Black' : 'White')) : ''}`}>Enemy: {opponentName}</div>
        </div>
      )}
    </>
  );
}

export default App;