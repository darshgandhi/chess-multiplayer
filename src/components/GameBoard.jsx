import React, { useState, useEffect} from 'react'
import '../styles/GameBoard.css'
import { Board } from '../models/Board.js';
import Square from './Square.jsx';
import HighlightSquare from './HighlightSquare.jsx';
import HoverSquare from './HoverSquare.jsx';
import MoveableSquare from './MoveableSquare.jsx';

function GameBoard() {
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const fen_array = fen.split(" ");

  const [fen_pos, setFen_pos] = useState(fen_array[0]);
  const [turn, setTurn] = useState(fen_array[1]);
  const [castling, setCastling] = useState(fen_array[2]);
  const [enpassant, setEnpassant] = useState(fen_array[3]);
  const [halfmove, setHalfmove] = useState(fen_array[4]);
  const [fullmove, setFullmove] = useState(fen_array[5]);
  const [selected, setSelected] = useState(null);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [boardClass, setBoardClass] = useState(null);
  const [visualBoard, setVisualBoard] = useState([]);
  const [highlightedSqaure, setHighlightedSquare] = useState(null)
  const [hoverSqaure, setHoverSqaure] = useState(<HoverSquare position={10}/>)
  const [tilePosition, setTilePosition] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [moveableSquares, setMoveableSquares] = useState([])
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [moveToPiece, setMoveToPiece] = useState(null)

  useEffect(() => {
    const b = new Board(fen_pos);
    setBoardClass(b);
    initBoard(b);
  }, [fen_pos])

  useEffect(() => {
    if (selected !== null && !selected.classList.contains("chessboard")) {
      let sC = selected.classList;
      if (sC.contains("moveable-square") || (sC.contains("black") && turn == "w") || (sC.contains("white") && turn == "b")) {
        setHighlightedSquare(null);
        setMoveableSquares([]);
        let movePosition;
        const position = selectedPiece.className.split("-")[1];
        if (sC.contains("moveable-square")) {
          movePosition = selected.className.split("-")[2];
        } else {
          movePosition = selected.className.split("-")[1];
        }
        console.log("Move: ", getRowCol(position));
        console.log("To: ", movePosition);
        if (boardClass.board[movePosition-1] !== ".") {
          let piece = boardClass.board[position-1];
          let [valid_moves, attack_moves] = piece.validMoves(boardClass.board, getRowCol(position));
          console.log(attack_moves);
          console.log(movePosition);
          console.log(attack_moves.includes(Number(movePosition)))
          if (!attack_moves.includes(Number(movePosition))) {
            console.log("ghere")
            return;
          }
        }
        let temp = boardClass.board[position-1];
        boardClass.board[movePosition-1] = temp;
        boardClass.board[position-1] = ".";
        setFen_pos(boardClass.getFen(false));
        setSelectedPiece(null);
        setSelected(null);
      } else {
        setSelectedPiece(selected);
        setHighlightedSquare(<HighlightSquare selected={selected}/>);
        const [nameClass, position] = selected.className.split("-");
        let piece = boardClass.board[position-1];
        let [valid_moves, attack_moves] = piece.validMoves(boardClass.board, getRowCol(position));
        console.log(valid_moves)
        let moveable_squares = []
        for(let i = 0; i < valid_moves.length; i++) {
          moveable_squares.push(<MoveableSquare position={valid_moves[i]}/>)
        }
        setMoveableSquares(moveable_squares);
      }
    }
  }, [selected]);

  useEffect(() => {
    if(isMouseDown) {
      setHoverSqaure(<HoverSquare position={tilePosition}/>)
    } else {
      setHoverSqaure(null)
    }
  }, [tilePosition]);

  useEffect(() => {
  }, [isMouseDown])

  useEffect(() => {
  }, [selectedPiece])

  useEffect(() => {
  }, [moveToPiece])

  function initBoard(b){
    const newVisualBoard = []
    const pieceTypeMap = {
      Pawn: "pawn",
      Rook: "rook",
      Knight: "knight",
      Bishop: "bishop",
      King: "king",
      Queen: "queen",
    };
  
    for (let row = b.board.length-1, i = 0; row >= 0; row--, i++) {
        let piece = b.board[i];
        let position = i+1;
        if (piece !== ".") {
          newVisualBoard.push(<Square pieceType={pieceTypeMap[piece.type]} colorClass={piece.color === 0 ? "white" : "black"} position={position} key={position}/>);
        }
    }
    setVisualBoard(newVisualBoard);
  }

  function handleMouseDown(e){
    if(!e.target.classList.contains("chessboard")) {
      setIsMouseDown(true)
      console.log(turn);
      if(turn == "w") {
        if (e.target.classList.contains("white")) {
          setSelected((prev) => (prev === e.target ? null : e.target));
        } else if (selectedPiece.classList.contains("white") && e.target.classList.contains("black")) {
          setMoveToPiece(e.target);
          setSelected((prev) => (prev === e.target ? null : e.target));
        } else {
          console.log(e.target);
          setSelected((prev) => (prev === e.target ? null : e.target));
        }
      } else if (turn == "b" && e.target.classList.contains("black")) {
        setSelected((prev) => (prev === e.target ? null : e.target));
      } else {
        console.log(e.target);
      }
    }
  }

  function handleMouseMove(e){
    let position = getTilePosition(e);
  }

  function getTilePosition(e){
    const chessboardRect = document.querySelector('.chessboard').getBoundingClientRect();     
    const x = parseInt(e.clientX - chessboardRect.left);
    const y = parseInt(e.clientY - chessboardRect.top);
    let position = Math.floor(x / 100)+(Math.floor(y / 100)*8)+1;
    if (position !== tilePosition) {
      setTilePosition(position);
    }
    return tilePosition;
  }

  function handleMouseUp(e){
    setIsMouseDown(false)
    if(selected === null || selected.classList.contains("chessboard")) {
      setHighlightedSquare(null);
      setMoveableSquares([]);
    }
    setOffset({x: 0, y: 0});
  }

  function getRowCol(position) {
    return [Math.floor((position-1)/8 + 1), (position-1)%8 + 1]
  }

  return (
    <div className='chessboard'
    onMouseDown={e=>handleMouseDown(e)} 
    onMouseMove={e=> handleMouseMove(e)}
    onMouseUp={e=>handleMouseUp(e)}
    >
      {highlightedSqaure}
      {moveableSquares}
      {hoverSqaure}
      {visualBoard}
      </div>
  )
}

export default GameBoard
