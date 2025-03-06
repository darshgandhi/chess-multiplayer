import { forwardRef, useEffect, useImperativeHandle } from "react";
import useGameContext from "../hooks/useGameContext.js";
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
      handleResign,
      handleExit,
      endReason,
      setWinReason,
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
      winReason,
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
      setLocalScore(score);
    }, [score, setLocalScore]);

    useEffect(() => {
      setLocalFen(fen);
    }, [fen, setLocalFen]);

    useEffect(() => {
      if (winReason) {
        setWinReason(winReason);
      }
    }, [winReason, setWinReason]);

    return (
      <>
        <div>
          {endReason && (
            <div className="game-over-menu">
              <h2 className="title">Game Over: {endReason.reason}</h2>
              <p className="">{endReason.message}</p>
              <button className="exit-button" onClick={handleExit}>
                Exit
              </button>
            </div>
          )}
        </div>
        <div className="main-div">
          <div
            draggable="false"
            style={{
              transform: playerColor === "b" ? "rotate(180deg)" : "none",
              ...(playerColor !== currentTurn || endReason
                ? { pointerEvents: "none" }
                : {}),
            }}
            className={`chessboard`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {highlightedSquare}
            {moveableSquares}
            {hoverSquare}
            {visualBoard}
            {promoteBoard}
          </div>
          <button
            style={{
              ...(endReason ? { pointerEvents: "none" } : {}),
            }}
            className={`resign-button`}
            onClick={handleResign}
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
            <div>You: {playerName}</div>
            <div className="font-bold">
              {playerColor === "w"
                ? serverScore["white"]
                : serverScore["black"]}
            </div>
          </div>
          <div
            className={`opponent ${
              currentTurn === playerColor
                ? ""
                : "turn" + (playerColor === "b" ? "Black" : "White")
            }`}
          >
            <div>Opponent: {opponentName}</div>
            <div className="font-bold">
              {playerColor === "w"
                ? serverScore["black"]
                : serverScore["white"]}
            </div>
          </div>
        </div>
      </>
    );
  }
);

GameBoard.displayName = "GameBoard";

export default GameBoard;
