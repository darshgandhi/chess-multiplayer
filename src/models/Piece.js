export class Piece {
    constructor(color, type) {
        this.color = color; // 0 is white, 1 is black
        this.type = type;
    }
}

export class Pawn extends Piece {
    constructor(color) {
        super(color, 'Pawn');
    }

    isValidMove(board, start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;
        
        if (this.color == 0) {
            if ((endRow === startRow-1 || endRow === startRow-2 && startRow == 6) && endCol == startCol && endRow >= 0) {
                return true;
            }
        } else {
            if ((endRow === startRow+1 || endRow === startRow+2 && startRow == 1) && endCol == startCol && endRow < 8) {
                return true;
            }
        }
        return;
    }

    validMoves(board, position) {
        const [startRow, startCol] = position;
        position = ((startRow-1)*8 + startCol);
        let valid_moves = []
        let attack_moves = []
        if (this.color == 0) {
            if (board[position-9] === "." && position-8 > 0) {
                valid_moves.push(position-8)
            }
            if (board[position-17] === "." && position > 48 && position < 57) {
                valid_moves.push(position-16)
            }
            if (board[position-10] !== "." && board[position-10].color == 1 && position-8 > 0) {
                attack_moves.push(position-9)
            }
            if (board[position-8] !== "." && board[position-8].color == 1 && position-8 > 0) {
                attack_moves.push(position-7)
            }
        } else {
            if (board[position+7] === "." && position+8 < 64) {
                valid_moves.push(position+8)
            }
            if (board[position+15] === "." && position > 8 && position < 17) {
                valid_moves.push(position+16)
            }
            if (board[position+8] !== "." && board[position+8].color == 0 && position+8 < 64) {
                attack_moves.push(position+9)
            }
            if (board[position+6] !== "." && board[position+6].color == 1 && position-8 > 0) {
                attack_moves.push(position+7)
            }
        }
        return [valid_moves, attack_moves];
    }
}

export class Rook extends Piece {
    constructor(color) {
        super(color, 'Rook');
    }

    isValidMove(board, start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;

        if ((endRow === startRow || endCol === startCol) && (endRow >= 0 && endRow < 8 && startCol >= 0 && endCol < 8)) {
            return true;
        }
        return false;
    }

    validMoves(board, position) {
        let valid_moves = [];
        let attack_moves = [];
        const [startRow, startCol] = position;
        const checkDirection = [
            [1, 0], // Down
            [-1, 0], // Up
            [0, 1], // Right
            [0, -1] // Left
        ];
        checkDirection.forEach(([dRow, dCol]) => {
            let r = dRow+startRow;
            let c = dCol+startCol;
            while (dCol > 0 && dCol < 9 && dRow > 0 && dRow < 9) {
                let new_pos = r * 8 + c;
                if (board[new_pos] === ".") {
                    valid_moves.push(new_pos);
                } else {
                    break;
                }
                r += dRow;
                c += dCol;
            }
        });
        return [valid_moves, attack_moves];
    }
}

export class Knight extends Piece {
    constructor(color) {
        super(color, 'Knight');
    }

    isValidMove(board, start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;
        const possibleMoves = [
            [startRow-2, startCol-1],
            [startRow-2, startCol+1],
            [startRow+2, startCol-1],
            [startRow+2, startCol+1],
            [startRow-1, startCol-2],
            [startRow-1, startCol+2],
            [startRow+1, startCol-2],
            [startRow+1, startCol+2],
        ];

        if (possibleMoves.some(([row, col]) => row === endRow && col == endCol)) {
            return true;
        }
        return false;
    }

    validMoves(board, position) {
        let valid_moves = []
        let true_pos = position-1
        const possibleMoves = [
            true_pos-6,
            true_pos-10,
            true_pos-15,
            true_pos-17,
            true_pos+6,
            true_pos+10,
            true_pos+15,
            true_pos+17,
        ];

        possibleMoves.forEach((pos) => {
            if (board[pos] === ".") {
                valid_moves.push(pos+1);
            }
        });
        return valid_moves
    }
}

export class Bishop extends Piece {
    constructor(color) {
        super(color, 'Bishop');
    }

    isValidMove(board, start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;

        rowDiff = Math.abs(endRow - startRow);
        colDiff = Math.abs(endCol - startCol);

        if (rowDiff === colDiff && rowDiff >= 0 && rowDiff < 8 && colDiff >= 0 && colDiff < 8) {
            return true;
        }

        return false;
    }
}

export class King extends Piece {
    constructor(color) {
        super(color, 'King');
    }

    isValidMove(board, start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;

        rowDiff = Math.abs(endRow - startRow);
        colDiff = Math.abs(endCol - startCol);

        if ((colDiff === 1 && rowDiff === 1) || (colDiff === 1 && rowDiff === 0) || (colDiff === 0 && rowDiff === 1)) {
            return true;
        }

        return false;
    }
}

export class Queen extends Piece {
    constructor(color) {
        super(color, 'Queen')
    }

    isValidMove(board, start, end) {
        const [startRow, startCol] = start;
        const [endRow, endCol] = end;

        rowDiff = Math.abs(endRow - startRow);
        colDiff = Math.abs(endCol - startCol);

        if ((endRow === startRow || endCol === startCol) && (endRow >= 0 && endRow < 8 && startCol >= 0 && endCol < 8)) {
            return true;
        }

        if ((colDiff === 1 && rowDiff === 1) || (colDiff === 1 && rowDiff === 0) || (colDiff === 0 && rowDiff === 1)) {
            return true;
        }
        return false;
    }
}