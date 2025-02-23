import {
  getRowCol,
  updateBoard,
  getTilePosition,
  generateMoveableSquares,
  handlePawnMoves,
  handleCastling,
} from "../Utils/gameLogic.jsx";
import { useEffect, useState } from "react";
import { Board } from "../../server/models/Board.js";
import React from "react";
import Square from "../components/Square.jsx";
import PromotePawn from "../components/PromotePawn.jsx";
import HoverSquare from "../components/HoverSquare.jsx";

export default function useGameContext({
  serverFen,
  playerColor,
  serverScore,
}) {
  // ========================
  // State Variables
  // ========================

  // Game Board State
  const [fen, setFen] = useState(serverFen);
  const [board, setBoard] = useState(new Board());
  const [turn, setTurn] = useState();
  const [fullMove, setFullMove] = useState(null);
  const [halfMove, setHalfMove] = useState(null);

  // UI State
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const [hoverSquare, setHoverSquare] = useState(null);
  const [moveableSquares, setMoveableSquares] = useState([]);
  const [visualBoard, setVisualBoard] = useState([]);
  const [promoteBoard, setPromoteBoard] = useState();

  // Selection State
  const [selected, setSelected] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moveToPiece, setMoveToPiece] = useState(null);
  const [promoteTo, setPromoteTo] = useState(null);

  // Moves State
  const [validMovesList, setValidMovesList] = useState([]);
  const [attackMoves, setAttackMoves] = useState([]);
  const [specialMoves, setSpecialMoves] = useState({
    enpassant: null,
    castle: null,
  });
  const [promotionState, setPromotionState] = useState({
    show: false,
    position: null,
    color: null,
  });

  // Mouse Tracking State
  const [tilePosition, setTilePosition] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Score State
  const [point, setPoint] = useState(0);
  const [score, setScore] = useState(serverScore);
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

  useEffect(() => {
    if (serverFen) {
      setFen(serverFen);
    }
  }, [serverFen]);

  useEffect(() => {
    if (serverScore) {
      console.log("here");
      setScore(serverScore);
    }
  }, [serverScore]);

  // Update Board State & Check for Checkmate
  useEffect(() => {
    if (board && !gameOver) {
      let mate = board.checkMate(board.turn == "w" ? 0 : 1);
      if (
        ((mate == "S" || mate == "C") && fullMove && fullMove > 1) ||
        (halfMove && halfMove === 50)
      ) {
        if (mate == "C") {
          console.log("Check Mate");
        } else {
          console.log("Stale Mate");
        }
        setGameOver(true);
      }
      setVisualBoard(updateBoard(board, playerColor));
      setTurn(board.turn);
      setFullMove(board.fullmove);
      setHalfMove(board.halfmove);
    }
  }, [board]);

  // Update Score when a Piece is Captured
  useEffect(() => {
    if (point) {
      console.log("adding point:", point);
      setScore((prev) => ({
        ...prev,
        [turn === "w" ? "white" : "black"]:
          prev[turn === "w" ? "white" : "black"] + point,
      }));
    }
  }, [point]);

  useEffect(() => {
    if (score) {
      console.log("score updated: ", score);
      setPoint(0);
    }
  }, [score]);

  // Handle Piece Selection
  useEffect(() => {
    if (
      selected !== null &&
      !selected.classList.contains("chessboard") &&
      ((turn == "w" &&
        selected.classList.contains("white") &&
        playerColor == "w") ||
        (turn == "b" &&
          selected.classList.contains("black") &&
          playerColor == "b"))
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
      if (piece.type === "King") {
        let castle = handleCastling(
          piece,
          board,
          valid_moves,
          attack_moves,
          tile_pos
        );
        setSpecialMoves((prev) => ({ ...prev, castle: castle }));
      } else if (piece.type === "Pawn") {
        let enpassantPos = null;
        [attack_moves, enpassantPos] = handlePawnMoves(attack_moves, board);
        setSpecialMoves((prev) => ({ ...prev, enpassant: enpassantPos }));
      }
      [valid_moves, attack_moves] = board.verifyMoves(
        tile_pos,
        valid_moves,
        attack_moves,
        playerColor == "w" ? 0 : 1
      );
      setAttackMoves(attack_moves);
      setValidMovesList(valid_moves);
    }
  }, [selected]);

  // Show Movable Locations
  useEffect(() => {
    setMoveableSquares(generateMoveableSquares(attackMoves, validMovesList));
  }, [attackMoves, validMovesList]);

  const handlePromotion = (piece) => {
    console.log("Pawn promoted to:", piece);
    setPromoteTo(piece);
  };

  useEffect(() => {
    if (promotionState["show"]) {
      setPromoteBoard(
        <PromotePawn
          position={promotionState["position"]}
          onPromote={handlePromotion}
        />
      );
    } else {
      setPromoteBoard();
    }
  }, [promotionState]);

  useEffect(() => {
    if (promoteTo && board) {
      let oPos = selectedPiece.className.split("-")[1] - 1;
      let p = board.promotePawn(
        promotionState["position"] - 1,
        promoteTo,
        promotionState["color"],
        oPos
      );
      setPoint(p);
      setFen(board.getFen(attackMoves.includes(moveToPiece)));
      setHighlightedSquare(null);
      setMoveableSquares([]);
      setAttackMoves([]);
      setValidMovesList([]);
      setPromotionState({
        show: false,
        position: null,
        color: null,
      });
      setPromoteTo(null);
    }
  }, [promoteTo]);

  // Handle Attacks & Moves
  useEffect(() => {
    if (board) {
      if (
        attackMoves.includes(moveToPiece) ||
        validMovesList.includes(moveToPiece)
      ) {
        let oPos = selectedPiece.className.split("-")[1] - 1;
        if (
          board.board[oPos].type === "Pawn" &&
          ((board.board[oPos].color == 0 &&
            moveToPiece > 0 &&
            moveToPiece < 9) ||
            (board.board[oPos].color == 1 &&
              moveToPiece > 56 &&
              moveToPiece < 65))
        ) {
          let pawn = board.board[oPos];
          console.log("promote white");
          setPromotionState({
            show: true,
            position: moveToPiece,
            color: pawn.color,
          });
        } else {
          let p = board.movePiece(oPos, moveToPiece - 1, specialMoves);
          if (board.enpassant === "-" && specialMoves["enpassant"]) {
            setSpecialMoves((prev) => ({
              ...prev,
              enpassant: null,
            }));
          }
          if (specialMoves["castle"]) {
            setSpecialMoves((prev) => ({
              ...prev,
              castle: null,
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
    }
  }, [moveToPiece]);

  const resetGame = () => {
    setFen();
    setBoard(new Board());
    setScore({ white: 0, black: 0 });
    setGameOver(false);
    setTurn();
    setMoveableSquares([]);
    setHighlightedSquare(null);
  };

  // ========================
  // Return Context
  // ========================
  return {
    highlightedSquare,
    moveableSquares,
    hoverSquare,
    visualBoard,
    score,
    fen,
    gameOver,
    promoteBoard,
    resetGame,
    handleMouseDown: (e) => {
      if (promotionState.show) {
        return;
      }
      setMoveableSquares([]);
      setHighlightedSquare(null);
      setIsMouseDown(true);
      setSelected((prev) => (prev === e.target ? null : e.target));
    },
    handleMouseMove: (e) => {
      let tilePos = getTilePosition(e, tilePosition, playerColor);
      setTilePosition(tilePos);
      if (isMouseDown && turn == playerColor) {
        setHoverSquare(<HoverSquare position={tilePos} />);
      }
    },
    handleMouseUp: (e) => {
      setIsMouseDown(false);
      setHoverSquare(null);
      if (selected) setMoveToPiece(tilePosition);
      setOffset({ x: 0, y: 0 });
    },
  };
}
