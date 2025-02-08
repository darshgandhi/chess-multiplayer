import { Pawn, Rook, Knight, King, Queen, Bishop } from "./Piece.js";
import { getRowCol } from "../Utils/gameLogic.jsx";
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
    let oPiece = this.board[start];
    this.board[start] = ".";
    this.board[end] = oPiece;
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

  allLegalMoves() {
    const legal_moves = new Map();
    for (let i = 0; i < 64; i++) {
      let piece = this.board[i];
      if (piece !== ".") {
        let [valid_moves, attack_moves] = piece.validMoves(
          this.board,
          getRowCol(i + 1)
        );
        let moves = [...valid_moves, ...attack_moves];
        if (moves.length > 0) {
          legal_moves.set(piece, [i + 1, moves]);
        }
      }
    }
    return legal_moves;
  }

  safeKingMoves(position) {
    const safe_moves = new Map();
    let king = this.board[position];
    let [valid_moves, attack_moves] = king.validMoves(
      this.board,
      getRowCol(position + 1)
    );
    for (let i = 0; i < attack_moves.length; i++) {
      let oPiece = this.board[position];
      let mPiece = this.board[attack_moves[i] - 1];
      this.board[position] = ".";
      this.board[attack_moves[i] - 1] = oPiece;
      let inCheck = !this.inCheck()[0];
      this.board[position] = oPiece;
      this.board[attack_moves[i] - 1] = mPiece;
      if (inCheck) {
        safe_moves.set(king, [[attack_moves[i], "A"]]);
      }
    }
    for (let i = 0; i < valid_moves.length; i++) {
      let oPiece = this.board[position];
      let mPiece = this.board[valid_moves[i] - 1];
      this.board[position] = ".";
      this.board[valid_moves[i] - 1] = oPiece;
      let inCheck = !this.inCheck()[0];
      this.board[position] = oPiece;
      this.board[valid_moves[i] - 1] = mPiece;
      if (inCheck) {
        safe_moves.set(king, [[attack_moves[i], "M"]]);
      }
    }
    if (safe_moves.size == 0) {
      let allMoves = Array.from(this.allLegalMoves());
      for (let i = 0; i < allMoves.length; i++) {
        let piece = allMoves[i][0];
        let legal_moves = allMoves[i][1];
        for (let j = 0; j < legal_moves[1].length; j++) {
          if (piece.color == king.color) {
            let oPiece = this.board[legal_moves[0] - 1];
            let mPiece = this.board[legal_moves[1][j] - 1];
            this.board[legal_moves[0] - 1] = ".";
            this.board[legal_moves[1][j] - 1] = oPiece;
            if (legal_moves[1][j] - 1 !== position && !this.inCheck()[0]) {
              this.board[legal_moves[0] - 1] = oPiece;
              this.board[legal_moves[1][j] - 1] = mPiece;
              if (this.board[legal_moves[1][j] - 1] !== ".") {
                if (!safe_moves.has(piece)) {
                  safe_moves.set(piece, [[legal_moves[1][j], "A"]]);
                } else {
                  safe_moves.get(piece).push([legal_moves[1][j], "A"]);
                }
              } else {
                if (!safe_moves.has(piece)) {
                  safe_moves.set(piece, [[legal_moves[1][j], "M"]]);
                } else {
                  safe_moves.get(piece).push([legal_moves[1][j], "M"]);
                }
              }
            } else {
              this.board[legal_moves[0] - 1] = oPiece;
              this.board[legal_moves[1][j] - 1] = mPiece;
            }
          }
        }
      }
    }
    return safe_moves;
  }

  copyBoard() {
    return this.board.map((piece) => {
      if (piece === ".") return ".";
      const pieceCopy = Object.create(Object.getPrototypeOf(piece));
      Object.assign(pieceCopy, piece);
      return pieceCopy;
    });
  }
}
