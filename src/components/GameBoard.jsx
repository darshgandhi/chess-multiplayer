import React, { useState, useEffect } from "react";
import "../styles/GameBoard.css";
import { Board } from "../models/Board.js";
import Square from "./Square.jsx";
import HoverSquare from "./HoverSquare.jsx";

function GameBoard() {
  // Hooks
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [selected, setSelected] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [board, setBoard] = useState(new Board(fen));
  const [turn, setTurn] = useState("w");
  const [visualBoard, setVisualBoard] = useState([]);
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const [hoverSquare, setHoverSquare] = useState(null);
  const [tilePosition, setTilePosition] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [moveableSquares, setMoveableSquares] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMovesList, setValidMovesList] = useState([]);
  const [attackMoves, setAttackMoves] = useState([]);
  const [moveToPiece, setMoveToPiece] = useState(null);

  // Use Effect Actions
  useEffect(() => {
    const handleMouseUpGlobal = (e) => {
      if (isMouseDown) {
        setIsMouseDown(false);
        setHoverSquare(null);
        if (
          selected !== null &&
          !selected.classList.contains(`square-${tilePosition}`)
        ) {
          setMoveToPiece(tilePosition);
        }
        if (selected === null || selected.classList.contains("chessboard")) {
          setMoveableSquares([]);
          setHighlightedSquare(null);
        }
        setOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener("mouseup", handleMouseUpGlobal);

    return () => {
      document.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, [isMouseDown, selected, tilePosition]);

  useEffect(() => {
    const chessboard = document.querySelector(".chessboard");
    chessboard.addEventListener("dragstart", (e) => {
      e.preventDefault(); // Prevent the drag behavior
    });

    return () => {
      chessboard.removeEventListener("dragstart", (e) => {
        e.preventDefault();
      });
    };
  }, []);

  useEffect(() => {
    updateBoard(board);
    console.log(board);
    setTurn(board.turn);
  }, [fen]);

  useEffect(() => {
    if (
      selected !== null &&
      !selected.classList.contains("chessboard") &&
      ((turn == "w" && selected.classList.contains("white")) ||
        (turn == "b" && selected.classList.contains("black")))
    ) {
      let tile_pos = selected.className.split("-")[1];
      setSelectedPiece(selected);
      setHighlightedSquare(
        <Square
          type={"highlight"}
          position={tile_pos}
          key={`highlight-square-${tile_pos}`}
        />
      );
      let piece = board.board[tile_pos - 1];
      let [valid_moves, attack_moves] = piece.validMoves(
        board.board,
        getRowCol(tile_pos)
      );
      setAttackMoves(attack_moves);
      setValidMovesList(valid_moves);
    }
  }, [selected]);

  useEffect(() => {
    console.log(validMovesList);
    if (attackMoves && validMovesList) {
      let moveable_squares = [];
      for (let i = 0; i < attackMoves.length; i++) {
        moveable_squares.push(
          <Square
            type={"attackable"}
            position={attackMoves[i]}
            key={`attack-square-${attackMoves[i]}`}
          />
        );
      }
      for (let i = 0; i < validMovesList.length; i++) {
        moveable_squares.push(
          <Square
            type={"hint"}
            position={validMovesList[i]}
            key={`hint-square-${validMovesList[i]}`}
          />
        );
      }
      setMoveableSquares(moveable_squares);
    }
  }, [attackMoves, validMovesList]);

  useEffect(() => {
    if (isMouseDown) {
      setHoverSquare(<HoverSquare position={tilePosition} />);
    }
  }, [tilePosition]);

  useEffect(() => {
    if (board) {
      if (attackMoves.includes(moveToPiece)) {
        board.movePiece(
          selectedPiece.className.split("-")[1] - 1,
          moveToPiece - 1
        );
        setFen(board.getFen());
        setHighlightedSquare(null);
        setMoveableSquares([]);
      } else if (validMovesList.includes(moveToPiece)) {
        board.movePiece(
          selectedPiece.className.split("-")[1] - 1,
          moveToPiece - 1
        );
        setFen(board.getFen());
        setHighlightedSquare(null);
        setMoveableSquares([]);
      }
    }
  }, [moveToPiece]);

  // Mouse Events

  function handleMouseDown(e) {
    setIsMouseDown(true);
    console.log(e.target.classList);
    console.log(turn);
    if (!e.target.classList.contains("chessboard")) {
      setSelected((prev) => (prev === e.target ? null : e.target));
    }
  }

  function handleMouseMove(e) {
    let position = getTilePosition(e);
  }

  function handleMouseUp(e) {
    setIsMouseDown(false);
    setHoverSquare(null);
    if (selected !== null) {
      setMoveToPiece(tilePosition);
    }
    if (selected === null || selected.classList.contains("chessboard")) {
      setMoveableSquares([]);
      setHighlightedSquare(null);
    }
    setOffset({ x: 0, y: 0 });
  }

  // Helper & Setup Functions

  function getTilePosition(e) {
    const chessboardRect = document
      .querySelector(".chessboard")
      .getBoundingClientRect();
    const x = parseInt(e.clientX - chessboardRect.left);
    const y = parseInt(e.clientY - chessboardRect.top);
    let position = Math.floor(x / 100) + Math.floor(y / 100) * 8 + 1;
    if (position !== tilePosition) {
      setTilePosition(position);
    }
    return tilePosition;
  }

  function updateBoard(b) {
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
    setVisualBoard(newVisualBoard);
  }

  function getRowCol(position) {
    return [Math.floor((position - 1) / 8 + 1), ((position - 1) % 8) + 1];
  }

  return (
    <div
      draggable="false"
      className="chessboard"
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseUp={(e) => handleMouseUp(e)}
    >
      {highlightedSquare}
      {moveableSquares}
      {hoverSquare}
      {visualBoard}
    </div>
  );
}

export default GameBoard;
