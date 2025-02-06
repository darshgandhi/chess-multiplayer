import React from "react";
import "../styles/HoverSquare.css";

function HoverSquare({ position }) {
  return (
    <div
      draggable="false"
      className={`draggable="false" hover-square square-${position}`}
    ></div>
  );
}

export default HoverSquare;
