import { Pawn, Rook, Knight, King, Queen, Bishop } from "./Piece.js";
import { getRowCol } from "../../src/Utils/gameLogic.jsx";
export class Board {
  constructor(
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  ) {
    this.fen = fen;
    [
      this.fen_pos,
      this.turn,
      this.castling,
      this.enpassant,
      this.halfmove,
      this.fullmove,
    ] = this.fen.split(" ");
    this.halfmove = parseInt(this.halfmove);
    this.fullmove = parseInt(this.fullmove);
    this.board = this.constructBoard();
  }

  constructBoard() {
    let board = [];
    for (let i = 0; i < this.fen_pos.length; i++) {
      let piece = this.fen_pos[i];
      if (piece !== "/") {
        if (!isNaN(parseInt(piece))) {
          for (let j = 0; j < parseInt(piece); j++) {
            board.push(".");
          }
        } else if (piece.toLowerCase() == "p") {
          board.push(new Pawn(piece == "p" ? 1 : 0));
        } else if (piece.toLowerCase() == "r") {
          board.push(new Rook(piece == "r" ? 1 : 0));
        } else if (piece.toLowerCase() == "n") {
          board.push(new Knight(piece == "n" ? 1 : 0));
        } else if (piece.toLowerCase() == "b") {
          board.push(new Bishop(piece == "b" ? 1 : 0));
        } else if (piece.toLowerCase() == "q") {
          board.push(new Queen(piece == "q" ? 1 : 0));
        } else if (piece.toLowerCase() == "k") {
          board.push(new King(piece == "k" ? 1 : 0));
        } else if (piece == " ") {
          break;
        }
      }
    }
    return board;
  }

  flipFen() {
    const fen = this.fen_pos
    const rows = fen.split("/")
    const newRows = []
    for (let i = rows.length - 1; i >= 0; i--) {
      let row = rows[i]
      let newRow = ""
      for (let j = 0; j < row.length; j++) {
        let piece = row[j]
        if (!isNaN(parseInt(piece))) {
          newRow += piece
        } else {
          newRow += piece.toLowerCase() == piece ? piece.toUpperCase() : piece.toLowerCase()
        }
      }
      newRows.push(newRow)
    }
    this.fen_pos = newRows.join("/")
    this.fen = `${this.fen_pos} ${this.turn} ${this.castling} ${this.enpassant} ${this.halfmove} ${this.fullmove}`;
  }

  getFen(capture) {
    let fen_pos = "";
    let blank = 0;
    for (let i = 0; i < 64; i++) {
      let piece = this.board[i];
      if (piece === ".") {
        blank += 1;
      } else {
        if (blank > 0) {
          fen_pos += blank;
          blank = 0;
        }
        if (piece.type == "Pawn") {
          fen_pos += piece.color == 0 ? "P" : "p";
        } else if (piece.type == "Rook") {
          fen_pos += piece.color == 0 ? "R" : "r";
        } else if (piece.type == "Knight") {
          fen_pos += piece.color == 0 ? "N" : "n";
        } else if (piece.type == "Bishop") {
          fen_pos += piece.color == 0 ? "B" : "b";
        } else if (piece.type == "Queen") {
          fen_pos += piece.color == 0 ? "Q" : "q";
        } else if (piece.type == "King") {
          fen_pos += piece.color == 0 ? "K" : "k";
        }
      }
      if ((i + 1) % 8 == 0 && i < 63) {
        if (blank > 0) {
          fen_pos += blank;
          blank = 0;
        }
        fen_pos += "/";
      }
    }

    if (blank !== 0) {
      fen_pos += blank;
    }

    this.fen_pos = fen_pos;

    if (this.turn == "w") {
      this.turn = "b";
    } else {
      this.turn = "w";
      this.fullmove += 1;
    }

    if (this.castling !== "-") {
      let board = this.board;
      let castling = "";
      castling +=
        board[63].type == "Rook" &&
        board[63].color == 0 &&
        board[60].type == "King" &&
        board[60].color == 0 &&
        this.castling.includes("K")
          ? "K"
          : "";
      castling +=
        board[56].type == "Rook" &&
        board[56].color == 0 &&
        board[60].type == "King" &&
        board[60].color == 0 &&
        this.castling.includes("Q")
          ? "Q"
          : "";
      castling +=
        board[7].type == "Rook" &&
        board[7].color == 1 &&
        board[4].type == "King" &&
        board[4].color == 1 &&
        this.castling.includes("k")
          ? "k"
          : "";
      castling +=
        board[0].type == "Rook" &&
        board[0].color == 1 &&
        board[4].type == "King" &&
        board[4].color == 1 &&
        this.castling.includes("q")
          ? "q"
          : "";
      if (castling == "") {
        this.castling = "-";
      } else {
        this.castling = castling;
      }
    }

    this.enpassant = this.enpassant;

    if (capture) {
      this.halfmove = 0;
    } else {
      this.halfmove += 1;
    }
    this.fen = `${this.fen_pos} ${this.turn} ${this.castling} ${this.enpassant} ${this.halfmove} ${this.fullmove}`;
    return this.fen;
  }

  promotePawn(position, type, color, oPos) {
    console.log(oPos)
    let piece = this.board[position]
    this.board[oPos] = ".";
    if (type == "queen") {
      this.board[position] = new Queen(color);
    } else if (type == "rook") {
      this.board[position] = new Rook(color);
    } else if (type == "bishop") {
      this.board[position] = new Bishop(color);
    } else {
      this.board[position] = new Knight(color);
    }
    if (piece !== ".") {
      const pieceTypeMap = {
        Pawn: 1,
        Rook: 5,
        Knight: 3,
        Bishop: 3,
        Queen: 9,
        King: 0,
      };
      return pieceTypeMap[piece.type]; 
    } else {
      return 0;
    }
  }

  movePiece(start, end, specialMoves) {
    let piece = this.board[end];
    const oPiece = this.board[start];
    this.board[start] = ".";
    this.board[end] = oPiece;
    this.enpassant = "-";
    // Handling Special Moves
    if (specialMoves['enpassant'] && end === specialMoves['enpassant']-1) {
      let ep_pos = specialMoves['enpassant']-1;
      if (this.turn == "w") {
        piece = this.board[ep_pos+8]
        this.board[ep_pos+8] = ".";
      } else {
        piece = this.board[ep_pos-8]
        this.board[ep_pos-8] = ".";
      }
    } else if (specialMoves['castle']) {
      if (specialMoves['castle'].includes(end+1)) {
        if(end-1 == 61) {
          this.board[end-1] = this.board[63]
          this.board[63] = "."
        } else if (end+1 == 59) {
          this.board[end+1] = this.board[56]
          this.board[56] = "."
        } else if (end+1 == 7) {
          this.board[end-1] = this.board[7]
          this.board[7] = "."
        } else {
          this.board[end+1] = this.board[0]
          this.board[0] = "."
        }
      }
    } else if (oPiece.type == "Pawn" && Math.abs(start - end) == 16) {
      const opponentColor = this.turn == "b" ? 0 : 1;
      const left_tile = this.board[end-1]
      const right_tile = this.board[end+1]
      if ((left_tile.type == "Pawn" && left_tile.color === opponentColor) || (right_tile.type == "Pawn" && right_tile.color === opponentColor)) {
        if (opponentColor == 0) {
          this.enpassant = this.getAlgebraic(end-8)
        } else {
          this.enpassant = this.getAlgebraic(end+8)
        }
      }
    }
    // Checking if piece was captured
    if (piece !== ".") {
      const pieceTypeMap = {
        Pawn: 1,
        Rook: 5,
        Knight: 3,
        Bishop: 3,
        Queen: 9,
        King: 0,
      };
      return pieceTypeMap[piece.type]; // Return value of captured piece
    } else {
      return 0;
    }
  }
  
  getAlgebraic(position) {
    let [row, col] = getRowCol(position);
    let alp = String.fromCharCode(col + "a".charCodeAt(0));
    let num = (8 - row + 1).toString();
    return alp + num;
  }

  getKingPos() {
    let positions = [];
    let piece = null;
    for (let i = 0; i < 64; i++) {
      piece = this.board[i];
      if (piece.type == "King") {
        positions.push(i);
        if (positions.length == 2) {
          return positions;
        }
      }
    }
  }

  inCheck() {
    let positions = this.getKingPos();
    let piece = null;
    for (let i = 0; i < 64; i++) {
      piece = this.board[i];
      if (piece !== ".") {
        let attack_moves = piece.validMoves(this.board, getRowCol(i + 1))[1];
        if (attack_moves.length > 0) {
          if (attack_moves.includes(positions[0] + 1)) {
            return [true, positions[0]];
          } else if (attack_moves.includes(positions[1] + 1)) {
            return [true, positions[1]];
          }
        }
      }
    }
    return [false, null];
  }

  getKingPosSpecific(color) {
    let piece = null;
    for (let i = 0; i < 64; i++) {
      piece = this.board[i];
      if (piece.type == "King" && piece.color == color) {
        return i
      }
    }
  }

  inCheckSpecific(kingColor) {
    const raw_pos = this.getKingPosSpecific(kingColor);
    let piece = null;
    for (let i = 0; i < 64; i++) {
      piece = this.board[i];
      if (piece !== "." && piece.color !== kingColor) {
        let attack_moves = piece.validMoves(this.board, getRowCol(i + 1))[1];
        if (attack_moves.length > 0) {
          if (attack_moves.includes(raw_pos + 1)) {
            return [true, raw_pos];
          }
        }
      }
    }
    return [false, null];
  }

  allLegalMoves(color) {
    const legal_moves = new Map();
    for (let i = 0; i < 64; i++) {
      let piece = this.board[i];
      if (piece !== "." && piece.color == color) {
        let [valid_moves, attack_moves] = piece.validMoves(
          this.board,
          getRowCol(i + 1)
        );
        [valid_moves, attack_moves] = this.verifyMoves(i+1, valid_moves, attack_moves, color)
        let moves = [...valid_moves, ...attack_moves];
        if (moves.length > 0) {
          legal_moves.set(piece, [i + 1, moves]);
        }
      }
    }
    return legal_moves;
  }

  verifyMoves(start, valid_moves, attack_moves, turnColor) {
    let new_valid_moves = [];
    let new_attack_moves = [];
    for (let i = 0; i < valid_moves.length; i++) {
      if (!this.resultsInCheck(start, valid_moves[i], turnColor)) {
        new_valid_moves.push(valid_moves[i]);
      }
    }
    for (let i = 0; i < attack_moves.length; i++) {
      if (!this.resultsInCheck(start, attack_moves[i], turnColor)) {
        new_attack_moves.push(attack_moves[i]);
      }
    }
    return [new_valid_moves, new_attack_moves];
  }

  resultsInCheck(start, end, turnColor) {
    let original_start = this.board[start - 1];
    let original_end = this.board[end - 1];
    let color = null;
    this.board[end - 1] = original_start;
    this.board[start - 1] = ".";
    let [checked, position] = this.inCheckSpecific(turnColor);
    if (position !== null) {
      color = this.board[position].color;
    }
    this.board[end - 1] = original_end;
    this.board[start - 1] = original_start;
    if (
      position !== null &&
      checked &&
      color !== null &&
      color === (this.turn == "b" ? 1 : 0)
    ) {
      return true;
    }
    return false;
  }

  checkMate(turnColor) {
    let [checked, _] = this.inCheckSpecific(turnColor);
    // Check if there are any safe moves
    if (checked) {
      let legal_moves = this.allLegalMoves(turnColor);
      for (let [piece, [position, moves]] of legal_moves) {
        if (piece.color !== (this.turn === "b" ? 1 : 0)) continue;
        for (let i = 0; i < moves.length; i++) {
          if (!this.resultsInCheck(position, moves[i], turnColor)) {
            return null;
          }
        }
      }
      return "C";
    }
    if(this.allLegalMoves(turnColor).size == 0) {
      return "S";
    }
    return null;
  }
}
