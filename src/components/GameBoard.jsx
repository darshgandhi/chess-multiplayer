import "../styles/GameBoard.css";
import useGameContext from "../hooks/useGameContext.jsx";
import { useEffect } from "react";

function GameBoard({ setScore }) {
  const {
    highlightedSquare,
    moveableSquares,
    hoverSquare,
    visualBoard,
    score,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useGameContext();

  useEffect(() => {
    setScore(score);
  }, [score, setScore]);

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
