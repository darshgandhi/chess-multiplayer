import React from "react";
import "../styles/Square.css";

function Square({ type, position }) {
  return (
    <div draggable="false" className={`tile ${type} square-${position}`}>
      {position}
    </div>
  );
}

export default Square;
