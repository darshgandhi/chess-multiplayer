import React from "react";
import "../styles/ScoreBoard.css";

export default function ScoreBoard({ bScore, wScore, p1, p2 }) {
  return (
    <div className="scoreboard">
      <div className="team White">
        <div className="color"></div>
        <div className="name">{p1}</div>
        <div className="score">{wScore}</div>
      </div>
      <div className="divider"></div>
      <div className="team Black">
        <div className="color"></div>
        <div className="name">{p2}</div>
        <div className="score">{bScore}</div>
      </div>
    </div>
  );
}
