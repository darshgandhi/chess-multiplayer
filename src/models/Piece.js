export class Piece {
  constructor(color, type) {
    this.color = color; // 0 is white, 1 is black
    this.type = type;
  }
}

export class Pawn extends Piece {
  constructor(color) {
    super(color, "Pawn");
  }

  isValidMove(board, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    if (this.color == 0) {
      if (
        (endRow === startRow - 1 ||
          (endRow === startRow - 2 && startRow == 6)) &&
        endCol == startCol &&
        endRow >= 0
      ) {
        return true;
      }
    } else {
      if (
        (endRow === startRow + 1 ||
          (endRow === startRow + 2 && startRow == 1)) &&
        endCol == startCol &&
        endRow < 8
      ) {
        return true;
      }
    }
    return;
  }

  validMoves(board, position) {
    const [startRow, startCol] = position;
    position = (startRow - 1) * 8 + startCol;
    let valid_moves = [];
    let attack_moves = [];
    if (this.color == 0) {
      if (board[position - 9] === "." && position - 8 > 0) {
        valid_moves.push(position - 8);
        if (board[position - 17] === "." && position > 48 && position < 57) {
          valid_moves.push(position - 16);
        }
      }
      const possibleAttacks = [
        [startRow - 1, startCol - 1],
        [startRow - 1, startCol + 1],
      ];

      possibleAttacks.forEach(([row, col]) => {
        if (row > 0 && row < 9 && col > 0 && col < 9) {
          let new_pos = (row - 1) * 8 + col;
          if (
            new_pos < 64 &&
            new_pos > 0 &&
            board[new_pos - 1] !== "." &&
            board[new_pos - 1].color !== board[position - 1].color
          ) {
            attack_moves.push(new_pos);
          }
        }
      });
    } else {
      if (board[position + 7] === "." && position + 8 < 64) {
        valid_moves.push(position + 8);
        if (board[position + 15] === "." && position > 8 && position < 17) {
          valid_moves.push(position + 16);
        }
      }
      const possibleAttacks = [
        [startRow + 1, startCol - 1],
        [startRow + 1, startCol + 1],
      ];
      possibleAttacks.forEach(([row, col]) => {
        if (row > 0 && row < 9 && col > 0 && col < 9) {
          let new_pos = (row - 1) * 8 + col;
          if (
            new_pos < 64 &&
            new_pos > 0 &&
            board[new_pos - 1] !== "." &&
            board[new_pos - 1].color !== board[position - 1].color
          ) {
            attack_moves.push(new_pos);
          }
        }
      });
    }
    return [valid_moves, attack_moves];
  }
}

export class Rook extends Piece {
  constructor(color) {
    super(color, "Rook");
  }

  isValidMove(board, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    if (
      (endRow === startRow || endCol === startCol) &&
      endRow >= 0 &&
      endRow < 8 &&
      startCol >= 0 &&
      endCol < 8
    ) {
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
      [0, -1], // Left
    ];
    checkDirection.forEach(([dRow, dCol]) => {
      let r = dRow + startRow;
      let c = dCol + startCol;
      while (c > 0 && c < 9 && r > 0 && r < 9) {
        let new_pos = (r - 1) * 8 + c;
        if (board[new_pos - 1] === ".") {
          valid_moves.push(new_pos);
        } else if (
          board[new_pos - 1].color !=
          board[(startRow - 1) * 8 + startCol - 1].color
        ) {
          attack_moves.push(new_pos);
          break;
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
    super(color, "Knight");
  }

  isValidMove(board, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const possibleMoves = [
      [startRow - 2, startCol - 1],
      [startRow - 2, startCol + 1],
      [startRow + 2, startCol - 1],
      [startRow + 2, startCol + 1],
      [startRow - 1, startCol - 2],
      [startRow - 1, startCol + 2],
      [startRow + 1, startCol - 2],
      [startRow + 1, startCol + 2],
    ];

    if (possibleMoves.some(([row, col]) => row === endRow && col == endCol)) {
      return true;
    }
    return false;
  }

  validMoves(board, position) {
    const [startRow, startCol] = position;
    let valid_moves = [];
    let attack_moves = [];
    const possibleMoves = [
      [startRow - 2, startCol - 1],
      [startRow - 2, startCol + 1],
      [startRow + 2, startCol - 1],
      [startRow + 2, startCol + 1],
      [startRow - 1, startCol - 2],
      [startRow - 1, startCol + 2],
      [startRow + 1, startCol - 2],
      [startRow + 1, startCol + 2],
    ];

    possibleMoves.forEach(([row, col]) => {
      if (row > 0 && row < 9 && col > 0 && col < 9) {
        let new_pos = (row - 1) * 8 + col;
        if (new_pos < 64 && new_pos > 0) {
          if (board[new_pos - 1] === ".") {
            valid_moves.push(new_pos);
          } else if (
            board[new_pos - 1].color !=
            board[(startRow - 1) * 8 + startCol - 1].color
          ) {
            attack_moves.push(new_pos);
          }
        }
      }
    });
    return [valid_moves, attack_moves];
  }
}

export class Bishop extends Piece {
  constructor(color) {
    super(color, "Bishop");
  }

  isValidMove(board, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    rowDiff = Math.abs(endRow - startRow);
    colDiff = Math.abs(endCol - startCol);

    if (
      rowDiff === colDiff &&
      rowDiff >= 0 &&
      rowDiff < 8 &&
      colDiff >= 0 &&
      colDiff < 8
    ) {
      return true;
    }

    return false;
  }

  validMoves(board, position) {
    let valid_moves = [];
    let attack_moves = [];
    const [startRow, startCol] = position;
    const checkDirection = [
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ];
    checkDirection.forEach(([dRow, dCol]) => {
      let r = dRow + startRow;
      let c = dCol + startCol;
      while (c > 0 && c < 9 && r > 0 && r < 9) {
        let new_pos = (r - 1) * 8 + c;
        if (board[new_pos - 1] === ".") {
          valid_moves.push(new_pos);
        } else if (
          board[new_pos - 1].color !=
          board[(startRow - 1) * 8 + startCol - 1].color
        ) {
          attack_moves.push(new_pos);
          break;
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

export class King extends Piece {
  constructor(color) {
    super(color, "King");
  }

  isValidMove(board, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    rowDiff = Math.abs(endRow - startRow);
    colDiff = Math.abs(endCol - startCol);

    if (
      (colDiff === 1 && rowDiff === 1) ||
      (colDiff === 1 && rowDiff === 0) ||
      (colDiff === 0 && rowDiff === 1)
    ) {
      return true;
    }

    return false;
  }

  validMoves(board, position) {
    const [startRow, startCol] = position;
    let valid_moves = [];
    let attack_moves = [];
    const possibleMoves = [
      [startRow, startCol - 1],
      [startRow, startCol + 1],
      [startRow + 1, startCol],
      [startRow - 1, startCol],
      [startRow - 1, startCol - 1],
      [startRow - 1, startCol + 1],
      [startRow + 1, startCol - 1],
      [startRow + 1, startCol + 1],
    ];

    possibleMoves.forEach(([row, col]) => {
      if (row > 0 && row < 9 && col > 0 && col < 9) {
        let new_pos = (row - 1) * 8 + col;
        if (new_pos < 64 && new_pos > 0) {
          if (board[new_pos - 1] === ".") {
            valid_moves.push(new_pos);
          } else if (
            board[new_pos - 1].color !=
            board[(startRow - 1) * 8 + startCol - 1].color
          ) {
            attack_moves.push(new_pos);
          }
        }
      }
    });
    if (this.color == 0 && startRow == 8 && startCol == 5) {
      if (board[61] === "." && board[62] === "." && board[63] !== "." && board[63].type == "Rook") {
        valid_moves.push(63)
      }
      if (board[59] === "." && board[58] === "." && board[57] === "." && board[56] !== "." && board[56].type == "Rook") {
        valid_moves.push(59)
      }
    } else if (this.color == 1 && startRow == 1 && startCol == 5){
      if (board[5] === "." && board[6] === "." && board[7] !== "." && board[7].type == "Rook") {
        valid_moves.push(7)
      }
      if (board[1] === "." && board[2] === "." && board[3] === "." && board[0] !== "." && board[0].type == "Rook") {
        valid_moves.push(3)
      }
    }
    console.log(valid_moves)
    return [valid_moves, attack_moves];
  }
}

export class Queen extends Piece {
  constructor(color) {
    super(color, "Queen");
  }

  isValidMove(board, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    rowDiff = Math.abs(endRow - startRow);
    colDiff = Math.abs(endCol - startCol);

    if (
      (endRow === startRow || endCol === startCol) &&
      endRow >= 0 &&
      endRow < 8 &&
      startCol >= 0 &&
      endCol < 8
    ) {
      return true;
    }

    if (
      (colDiff === 1 && rowDiff === 1) ||
      (colDiff === 1 && rowDiff === 0) ||
      (colDiff === 0 && rowDiff === 1)
    ) {
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
      [0, -1], // Left
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ];
    checkDirection.forEach(([dRow, dCol]) => {
      let r = dRow + startRow;
      let c = dCol + startCol;
      while (c > 0 && c < 9 && r > 0 && r < 9) {
        let new_pos = (r - 1) * 8 + c;
        if (board[new_pos - 1] === ".") {
          valid_moves.push(new_pos);
        } else if (
          board[new_pos - 1].color !=
          board[(startRow - 1) * 8 + startCol - 1].color
        ) {
          attack_moves.push(new_pos);
          break;
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
