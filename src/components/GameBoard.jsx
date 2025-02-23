import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
      setScore(score);
    }, [score, setLocalScore]);

    useEffect(() => {
      setLocalFen(fen);
    }, [fen, setLocalFen]);

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
          className={`chessboard ${startGame ? "" : "unclickable"}`}
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
        <button
          className={`resign-button ${!gameRunning ? "disabled" : ""}`}
          onClick={handleResign}
          disabled={!gameRunning}
        >
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

export default GameBoard;
