import React, { useState, useEffect } from "react";
import "../styles/Square.css";

function PromotePawn({ position, onPromote }) {
  const handlePromotion = (e) => {
    const piece = e.target.getAttribute("data-piece");
    console.log("Selected piece:", piece);
    onPromote(piece);
  };

  return (
    <div className={`square-${position}`}>
      <div className="promotion-container" onMouseDown={handlePromotion}>
        <div className="promotion-choice queen" data-piece="queen"></div>
        <div className="promotion-choice rook" data-piece="rook"></div>
        <div className="promotion-choice bishop" data-piece="bishop"></div>
        <div className="promotion-choice knight" data-piece="knight"></div>
      </div>
    </div>
  );
}

export default PromotePawn;

