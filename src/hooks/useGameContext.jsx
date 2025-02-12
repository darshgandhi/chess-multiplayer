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
  // Board
  const [fen, setFen] = useState();
  const [board, setBoard] = useState(new Board(fen));
  const [turn, setTurn] = useState(null);
  const [fullMove, setFullMove] = useState(null);
  const [halfMove, setHalfMove] = useState(null);

  // Board UI
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const [hoverSquare, setHoverSquare] = useState(null);
  const [moveableSquares, setMoveableSquares] = useState([]);
  const [visualBoard, setVisualBoard] = useState([]);

  // Selected Squares
  const [selected, setSelected] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moveToPiece, setMoveToPiece] = useState(null);

  // Moves Lists
  const [validMovesList, setValidMovesList] = useState([]);
  const [attackMoves, setAttackMoves] = useState([]);

  // Mouse Tracking
  const [tilePosition, setTilePosition] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Score
  const [point, setPoint] = useState(0);
  const [score, setScore] = useState({ white: 0, black: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Handling Mouse Behaviours
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
    const preventDrag = (e) => e.preventDefault();

    chessboard.addEventListener("dragstart", preventDrag);
    return () => chessboard.removeEventListener("dragstart", preventDrag);
  }, []);

  // Logic
  useEffect(() => {
    if (fen) {
      setBoard(new Board(fen));
    } else {
      setBoard(new Board());
    }
  }, [fen]);

  useEffect(() => {
    if (gameOver) {
      setFen(null);
      setScore({ white: 0, black: 0 });
      setGameOver(false);
    }
  }, [gameOver]);

  useEffect(() => {
    if (board && !gameOver) {
      let mate = board.checkMate();
      if ((mate && fullMove && fullMove > 1) || (halfMove && halfMove == 50)) {
        console.log("Game Over");
        setGameOver(true);
      }
      setVisualBoard(updateBoard(board));
      setTurn(board.turn);
      setFullMove(board.fullmove);
      setHalfMove(board.halfmove);
    }
  }, [board]);

  useEffect(() => {
    if (point) {
      setScore((prev) => ({
        ...prev,
        [turn === "w" ? "white" : "black"]:
          prev[turn === "w" ? "white" : "black"] + point,
      }));
    }
  }, [point]);

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
      [valid_moves, attack_moves] = board.verifyMoves(
        tile_pos,
        valid_moves,
        attack_moves
      );
      //console.log(" ");
      //console.log("Selected Piece: ", piece);
      //console.log("Valid Moves: ", valid_moves);
      //console.log("Attack Moves: ", attack_moves);
      setAttackMoves(attack_moves);
      setValidMovesList(valid_moves);
    }
  }, [selected]);

  // Show Movable Locations
  useEffect(() => {
    setMoveableSquares(generateMoveableSquares(attackMoves, validMovesList));
  }, [attackMoves, validMovesList]);

  useEffect(() => {
    if (isMouseDown) {
      setHoverSquare(<HoverSquare position={tilePosition} />);
    }
  }, [tilePosition]);

  // Handle Attacks & Moves
  useEffect(() => {
    if (board) {
      if (attackMoves.includes(moveToPiece)) {
        setPoint(
          board.movePiece(
            selectedPiece.className.split("-")[1] - 1,
            moveToPiece - 1
          )
        );
        setFen(board.getFen());
        setHighlightedSquare(null);
        setMoveableSquares([]);
        setAttackMoves([]);
        setValidMovesList([]);
      } else if (validMovesList.includes(moveToPiece)) {
        setPoint(
          board.movePiece(
            selectedPiece.className.split("-")[1] - 1,
            moveToPiece - 1
          )
        );
        setFen(board.getFen());
        setHighlightedSquare(null);
        setMoveableSquares([]);
        setAttackMoves([]);
        setValidMovesList([]);
      }
    }
  }, [moveToPiece]);

  return {
    highlightedSquare,
    moveableSquares,
    hoverSquare,
    visualBoard,
    score,
    gameOver,
    handleMouseDown: (e) => {
      setIsMouseDown(true);
      if (!e.target.classList.contains("chessboard")) {
        setSelected((prev) => (prev === e.target ? null : e.target));
      }
    },
    handleMouseMove: (e) => {
      setTilePosition(getTilePosition(e, tilePosition));
    },
    handleMouseUp: (e) => {
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
    },
  };
}
