import React from "react";
import "../styles/Square.css";

function Square({ type, position }) {
  return (
    <div className={`tile ${type} square-${position}`}></div>
  );
}

export default Square;
