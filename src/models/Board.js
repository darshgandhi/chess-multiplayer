import { Pawn, Rook, Knight, King, Queen, Bishop } from "./Piece.js";

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
        board[7].type == "Rook" &&
        board[7].color == 1 &&
        board[4].type == "King" &&
        board[4].color == 1
          ? "K"
          : "";
      castling +=
        board[0].type == "Rook" &&
        board[0].color == 1 &&
        board[4].type == "King" &&
        board[4].color == 1
          ? "Q"
          : "";
      castling +=
        board[63].type == "Rook" &&
        board[63].color == 0 &&
        board[60].type == "King" &&
        board[60].color == 0
          ? "k"
          : "";
      castling +=
        board[56].type == "Rook" &&
        board[56].color == 0 &&
        board[60].type == "King" &&
        board[60].color == 0
          ? "q"
          : "";
      if (castling == "") {
        this.castling = "-";
      } else {
        this.castling = castling;
      }
    }

    this.enpassant = "-"; // CODE THIS IN LATER

    if (capture) {
      this.halfmove = 0;
    } else {
      this.halfmove += 1;
    }

    this.fen = `${this.fen_pos} ${this.turn} ${this.castling} ${this.enpassant} ${this.halfmove} ${this.fullmove}`;
    return this.fen;
  }

  movePiece(start, end) {
    let piece = this.board[end];
    this.board[end] = this.board[start];
    this.board[start] = ".";
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
    }
  }
}
