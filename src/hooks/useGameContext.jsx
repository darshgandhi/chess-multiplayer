import {
  getRowCol,
  updateBoard,
  getTilePosition,
  generateMoveableSquares,
} from "../Utils/gameLogic.jsx";
import { useEffect, useState } from "react";
import { Board } from "../models/Board.js";
import React from "react";
import Square from "../components/Square.jsx";
import HoverSquare from "../components/HoverSquare.jsx";

export default function useGameContext() {
  // ========================
  // State Variables
  // ========================

  // Game Board State
  const [fen, setFen] = useState();
  const [board, setBoard] = useState(new Board());
  const [turn, setTurn] = useState(null);
  const [fullMove, setFullMove] = useState(null);
  const [halfMove, setHalfMove] = useState(null);

  // UI State
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const [hoverSquare, setHoverSquare] = useState(null);
  const [moveableSquares, setMoveableSquares] = useState([]);
  const [visualBoard, setVisualBoard] = useState([]);

  // Selection State
  const [selected, setSelected] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moveToPiece, setMoveToPiece] = useState(null);

  // Moves State
  const [validMovesList, setValidMovesList] = useState([]);
  const [attackMoves, setAttackMoves] = useState([]);
  const [specialMoves, setSpecialMoves] = useState({enpassant: null, castle: null});

  // Mouse Tracking State
  const [tilePosition, setTilePosition] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Score State
  const [point, setPoint] = useState(0);
  const [score, setScore] = useState({ white: 0, black: 0 });
  const [gameOver, setGameOver] = useState(false);

  // ========================
  // Effect Hooks
  // ========================

  // Handle Global Mouse Up Event
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

  // Prevent Dragging on Chessboard
  useEffect(() => {
    const chessboard = document.querySelector(".chessboard");
    const preventDrag = (e) => e.preventDefault();
    chessboard.addEventListener("dragstart", preventDrag);
    return () => chessboard.removeEventListener("dragstart", preventDrag);
  }, []);

  // Initialize Board from FEN
  useEffect(() => {
    setBoard(fen ? new Board(fen) : new Board());
  }, [fen]);

  // Reset Game on Game Over
  useEffect(() => {
    if (gameOver) {
      setFen();
      setScore({ white: 0, black: 0 });
      setGameOver(false);
    }
  }, [gameOver]);

  // Update Board State & Check for Checkmate
  useEffect(() => {
    if (board && !gameOver) {
      let mate = board.checkMate();
      if ((mate && fullMove && fullMove > 1) || (halfMove && halfMove === 50)) {
        setGameOver(true);
      }
      setVisualBoard(updateBoard(board));
      setTurn(board.turn);
      setFullMove(board.fullmove);
      setHalfMove(board.halfmove);
    }
  }, [board]);

  // Update Score when a Piece is Captured
  useEffect(() => { 
    if (point) {
      console.log("adding point:" ,point)
      setScore((prev) => ({
        ...prev,
        [turn === "w" ? "white" : "black"]:
          prev[turn === "w" ? "white" : "black"] + point,
      }));
    }
  }, [point]);

  useEffect(() => { 
    if (score) {
      setPoint(0)
    }
  }, [score]);

  // Handle Piece Selection
  useEffect(() => {
    if (
      selected !== null &&
      !selected.classList.contains("chessboard") &&
      ((turn == "w" && selected.classList.contains("white")) ||
        (turn == "b" && selected.classList.contains("black")))
    ) {
      let tile_pos = selected.className.split("-")[1];
      setSelectedPiece(selected);
      console.log(selected)
      setHighlightedSquare(
        <Square
          type={"highlight"}
          position={tile_pos}
          key={`highlight-square-${tile_pos}`}
        />
      );
      console.log(tile_pos - 1)
      let piece = board.board[tile_pos - 1];
      let [valid_moves, attack_moves] = piece.validMoves(
        board.board,
        getRowCol(tile_pos)
      );
      // ENSURE ENPASSANT OR CASTLE DONT RESULT IN CHECK AND IF IN CHECK DONT ALLOW CASTLING
      if (piece.type === "Pawn" && board.enpassant !== "-") {
        let col = board.enpassant.charCodeAt(0) - "a".charCodeAt(0);
        let row = 8 - parseInt(board.enpassant[1]);
        attack_moves.push(row * 8 + col + 1);
        setSpecialMoves((prev) => ({ 
          ...prev,
          enpassant: (row * 8 + col + 1)
        }));
      } else if (piece.type === "King" && board.castling !== "-") {
        let castle = [];
        if (piece.color === 0 && board.castling.includes("K")) {
          castle.push(63)
        }
        if (piece.color === 0 && board.castling.includes("Q")) {
          castle.push(59)
        }
        if (piece.color === 1 && board.castling.includes("k")) {
          castle.push(7)
        }
        if (piece.color === 1 && board.castling.includes("q")) {
          castle.push(3)
        }
        setSpecialMoves((prev) => ({ 
          ...prev,
          castle: castle
        }));
      }
      [valid_moves, attack_moves] = board.verifyMoves(
        tile_pos,
        valid_moves,
        attack_moves
      );
      setAttackMoves(attack_moves);
      setValidMovesList(valid_moves);
    }
  }, [selected]);

  // Show Movable Locations
  useEffect(() => {
    setMoveableSquares(generateMoveableSquares(attackMoves, validMovesList));
  }, [attackMoves, validMovesList]);

  // Handle Attacks & Moves
  useEffect(() => {
    if (board) {
      console.log(moveToPiece)
      if (
        attackMoves.includes(moveToPiece) ||
        validMovesList.includes(moveToPiece)
      ) {
        let p = board.movePiece(
          selectedPiece.className.split("-")[1] - 1,
          moveToPiece - 1,
          specialMoves);
        if (board.enpassant === "-" && specialMoves['enpassant']) {
          setSpecialMoves((prev) => ({ 
            ...prev,
            enpassant: null
          }));
        }
        if (specialMoves['castle']) {
          setSpecialMoves((prev) => ({ 
            ...prev,
            castle: null
          }));
        }
        setPoint(p);
        setFen(board.getFen(attackMoves.includes(moveToPiece)));
        setHighlightedSquare(null);
        setMoveableSquares([]);
        setAttackMoves([]);
        setValidMovesList([]);
      }
    }
  }, [moveToPiece]);

  // ========================
  // Return Context
  // ========================
  return {
    highlightedSquare,
    moveableSquares,
    hoverSquare,
    visualBoard,
    score,
    gameOver,
    handleMouseDown: (e) => {
      setMoveableSquares([]);
      setHighlightedSquare(null);
      setIsMouseDown(true);
      setSelected((prev) => (prev === e.target ? null : e.target));
    },
    handleMouseMove: (e) => {
      setTilePosition(getTilePosition(e, tilePosition));
    },
    handleMouseUp: (e) => {
      setIsMouseDown(false);
      setHoverSquare(null);
      if (selected) setMoveToPiece(tilePosition);
      setOffset({ x: 0, y: 0 });
    },
  };
}