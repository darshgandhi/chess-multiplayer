import {
  getRowCol,
  updateBoard,
  getTilePosition,
} from "../Utils/gameLogic.jsx";
import { useEffect, useState } from "react";
import { Board } from "../models/Board.js";
import React from "react";
import Square from "../components/Square.jsx";
import HoverSquare from "../components/HoverSquare.jsx";

export default function gameContext() {
  // Board
  const [fen, setFen] = useState();
  const [board, setBoard] = useState(new Board(fen));
  const [turn, setTurn] = useState(null);

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
  const [safeMoves, setSafeMoves] = useState([]);

  // Mouse Tracking
  const [tilePosition, setTilePosition] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Score
  const [point, setPoint] = useState(0);
  const [bScore, setBScore] = useState(0);
  const [wScore, setWScore] = useState(0);

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
    chessboard.addEventListener("dragstart", (e) => {
      e.preventDefault(); // Prevent the drag behavior
    });

    return () => {
      chessboard.removeEventListener("dragstart", (e) => {
        e.preventDefault();
      });
    };
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
    if (board) {
      let [inCheck, position] = board.inCheck(board.board);
      if (inCheck) {
        console.log("King Under Attack");
        let safe_moves = board.safeKingMoves(position);
        setSafeMoves(Array.from(safe_moves));
      }
      setVisualBoard(updateBoard(board));
      setTurn(board.turn);
    }
  }, [board]);

  useEffect(() => {
    console.log("Turn: ", turn);
  }, [turn]);

  useEffect(() => {
    if (point) {
      turn == "w" ? setWScore(wScore + point) : setBScore(bScore + point);
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
      if (safeMoves.length > 0) {
        console.log(safeMoves);
        let valid_moves = [];
        let attack_moves = [];
        for (let i = 0; i < safeMoves.length; i++) {
          if (safeMoves[i][0] === piece) {
            for (let j = 0; j < safeMoves[i][1].length; j++) {
              console.log(safeMoves[i][1][j]);
              if (safeMoves[i][1][j][1] === "A") {
                attack_moves.push(safeMoves[i][1][j][0]);
              } else {
                valid_moves.push(safeMoves[i][1][j][0]);
              }
            }
          }
        }
        console.log(" ");
        console.log("Selected Piece: ", piece);
        console.log("Attack Moves: ", valid_moves);
        console.log("Valid Moves: ", attack_moves);
        setAttackMoves(attack_moves);
        setValidMovesList(valid_moves);
      } else {
        let [valid_moves, attack_moves] = piece.validMoves(
          board.board,
          getRowCol(tile_pos)
        );
        console.log(" ");
        console.log("Selected Piece: ", piece);
        console.log("Attack Moves: ", valid_moves);
        console.log("Valid Moves: ", attack_moves);
        setAttackMoves(attack_moves);
        setValidMovesList(valid_moves);
      }
    }
  }, [selected]);

  // Show Movable Locations
  useEffect(() => {
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
        setSafeMoves([]);
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
        setSafeMoves([]);
      }
    }
  }, [moveToPiece]);

  return {
    highlightedSquare,
    moveableSquares,
    hoverSquare,
    visualBoard,
    bScore,
    wScore,
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
