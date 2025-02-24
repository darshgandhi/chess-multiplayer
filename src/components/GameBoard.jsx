import { forwardRef, useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import useGameContext from "../hooks/useGameContext.jsx";
import ScoreBoard from "./ScoreBoard.jsx";
import "../styles/GameBoard.css";
import "../styles/app.css";

const GameBoard = forwardRef(
  (
    {
      playerName,
      opponentName,
      playerColor,
      serverFen,
      serverScore,
      currentTurn,
      setLocalFen,
      setLocalScore,
      setGameOver,
    },
    ref
  ) => {
    const {
      highlightedSquare,
      moveableSquares,
      hoverSquare,
      visualBoard,
      score,
      fen,
      gameOver,
      promoteBoard,
      resetGame,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
    } = useGameContext({ serverFen, playerColor, serverScore });

    useImperativeHandle(ref, () => ({
      resetGame,
    }));

    useEffect(() => {
      setGameOver(gameOver);
    }, [gameOver, setGameOver]);

    useEffect(() => {
      setLocalScore(score);
    }, [score, setLocalScore]);

    useEffect(() => {
      setLocalFen(fen);
    }, [fen, setLocalFen]);

    function handleResign() {
      console;
    }

    return (
      <div className="main-div">
        <ScoreBoard
          bScore={serverScore["black"]}
          wScore={serverScore["white"]}
          p1={playerColor === "w" ? playerName : opponentName}
          p2={playerColor === "b" ? playerName : opponentName}
        />
        <div
          draggable="false"
          style={playerColor === "b" ? { transform: "rotate(180deg)" } : {}}
          className={`chessboard`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {promoteBoard}
          {highlightedSquare}
          {moveableSquares}
          {hoverSquare}
          {visualBoard}
        </div>
        <button className={`resign-button`} onClick={handleResign}>
          <p data-title="Resign" data-text="Resign :("></p>
        </button>
        <div
          className={`player ${
            currentTurn === playerColor
              ? "turn" + (playerColor === "b" ? "Black" : "White")
              : ""
          }`}
        >
          You: {playerName}
        </div>
        <div
          className={`opponent ${
            currentTurn !== playerColor
              ? "turn" + (playerColor !== "b" ? "Black" : "White")
              : ""
          }`}
        >
          Enemy: {opponentName}
        </div>
      </div>
    );
  }
);

GameBoard.displayName = "GameBoard";

GameBoard.propTypes = {
  playerName: PropTypes.string.isRequired,
  opponentName: PropTypes.string.isRequired,
  playerColor: PropTypes.oneOf(["w", "b"]).isRequired,
  serverFen: PropTypes.string.isRequired,
  serverScore: PropTypes.shape({
    white: PropTypes.number.isRequired,
    black: PropTypes.number.isRequired,
  }).isRequired,
  currentTurn: PropTypes.oneOf(["w", "b"]).isRequired,
  setLocalFen: PropTypes.func.isRequired,
  setLocalScore: PropTypes.func.isRequired,
  setGameOver: PropTypes.func.isRequired,
};

export default GameBoard;
