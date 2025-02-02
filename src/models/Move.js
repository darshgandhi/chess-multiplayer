export class Move {
    static isValidMove(board, start, end) {
        let piece = board[start[0]][start[1]]
        return piece.isValidMove(board, start, end);
    }

    static getPiece(board, location) {
        return board[location[0]][location[1]];
    }

    static movePiece(board, start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;

        board[endRow][endCol] = board[startRow][startCol];
        board[startRow][startCol] = ".";

        return true;
    }
}