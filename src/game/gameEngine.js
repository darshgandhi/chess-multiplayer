import { Board } from "../models/Board.js";
import { Move } from "../models/Move.js";
import promptSync from 'prompt-sync';

const DEFAULT_POS = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
const SECOND_POS = "r1k4r.p2nb1p1.2b4p.1p1n1p2.2PP4.3Q1NB1.1P3PPP.R5K1.";

const b = new Board(DEFAULT_POS)
b.showBoard()

const prompt = promptSync();

while (true) {
    let startPiece = prompt("Enter Piece to Move: ");
    let endPiece = prompt("Enter Location to Move Piece: ");
    let start = [parseInt(startPiece[0]), parseInt(startPiece[1])];
    let end = [parseInt(endPiece[0]), parseInt(endPiece[1])];
    if (Move.isValidMove(b.board, start, end)) {
        let selectedPiece = Move.getPiece(b.board, start);
        let moveTo = Move.getPiece(b.board, end);
        console.log(moveTo)
        if (moveTo == ".") {
            b.movePiece(start, end)
        }
    }
    b.showBoard()
}

