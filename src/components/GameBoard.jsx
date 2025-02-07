import "../styles/GameBoard.css";
import gameLogic from "../hooks/gameContext.jsx";
import { useEffect } from "react";

function GameBoard({ setBScore, setWScore }) {
  const {
    highlightedSquare,
    moveableSquares,
    hoverSquare,
    visualBoard,
    bScore,
    wScore,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = gameLogic();

  useEffect(() => {
    setBScore(bScore);
    setWScore(wScore);
  }, [bScore, wScore, setBScore, setWScore]);

  return (
    <div
      draggable="false"
      className="chessboard"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {highlightedSquare}
      {moveableSquares}
      {hoverSquare}
      {visualBoard}
    </div>
  );
}

export default GameBoard;
