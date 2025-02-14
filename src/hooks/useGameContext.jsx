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
  const [specialMoves, setSpecialMoves] = useState([]);

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
        console.log("Game Over");
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
      setScore((prev) => ({
        ...prev,
        [turn === "w" ? "white" : "black"]:
          prev[turn === "w" ? "white" : "black"] + point,
      }));
    }
  }, [point]);

  // Handle Piece Selection
  useEffect(() => {
    if (selected) {
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
      if (piece.type === "Pawn" && board.enpassant !== "-") {
        let col = enpassant.charCodeAt(0) - "a".charCodeAt(0);
        let row = 8 - parseInt(enpassant[1]);
        attack_moves.push(row * 8 + col + 1);
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
      if (
        attackMoves.includes(moveToPiece) ||
        validMovesList.includes(moveToPiece)
      ) {
        setPoint(
          board.movePiece(
            selectedPiece.className.split("-")[1] - 1,
            moveToPiece - 1
          )
        );
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
      setMoveableSquares([]);
      setHighlightedSquare(null);
      setOffset({ x: 0, y: 0 });
    },
  };
}
