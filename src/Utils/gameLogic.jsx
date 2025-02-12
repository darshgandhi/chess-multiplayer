import React from "react";
import Square from "../components/Square.jsx";
// helpers and Logic
export function getTilePosition(e, tilePosition) {
  const chessboardRect = document
    .querySelector(".chessboard")
    .getBoundingClientRect();
  const x = parseInt(e.clientX - chessboardRect.left);
  const y = parseInt(e.clientY - chessboardRect.top);
  let position = Math.floor(x / 100) + Math.floor(y / 100) * 8 + 1;
  if (position !== tilePosition) {
    return position;
  }
  return tilePosition;
}

export const generateMoveableSquares = (attackMoves, validMovesList) => {
  return [
    ...attackMoves.map((pos) => (
      <Square type={"attackable"} position={pos} key={`attack-square-${pos}`} />
    )),
    ...validMovesList.map((pos) => (
      <Square type={"hint"} position={pos} key={`hint-square-${pos}`} />
    )),
  ];
};

export function updateBoard(b) {
  const newVisualBoard = [];
  const pieceTypeMap = {
    Pawn: "pawn",
    Rook: "rook",
    Knight: "knight",
    Bishop: "bishop",
    King: "king",
    Queen: "queen",
  };

  for (let row = b.board.length - 1, i = 0; row >= 0; row--, i++) {
    let piece = b.board[i];
    let position = i + 1;
    if (piece !== ".") {
      let pieceType = pieceTypeMap[piece.type];
      let colorClass = piece.color === 0 ? "white" : "black";
      newVisualBoard.push(
        <Square
          type={`${pieceType} ${colorClass}`}
          position={position}
          key={position}
        />
      );
    }
  }
  return newVisualBoard;
}

export function getRowCol(position) {
  return [Math.floor((position - 1) / 8 + 1), ((position - 1) % 8) + 1];
}
