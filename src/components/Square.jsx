import React from "react";
import "../styles/Square.css";

function Square({ type, position, playerColor }) {
  return (
    <div 
    style={playerColor === "b" ? { transform: "rotate(180deg)" } : {}}
    className={`tile ${type} square-${position}`}></div>
  );
}

export default Square;
