import Square from "../components/Square.jsx";
import HoverSquare from "../components/HoverSquare.jsx";
import PromotePawn from "../components/PromotePawn.jsx";

// helpers and Logic

export function getTilePosition(e, tilePosition, playerColor) {
  const chessboardRect = document
    .querySelector(".chessboard")
    .getBoundingClientRect();
  const x = parseInt(e.clientX - chessboardRect.left);
  const y = parseInt(e.clientY - chessboardRect.top);
  let position = Math.floor(x / 100) + Math.floor(y / 100) * 8 + 1;
  if (playerColor === "b") {
    position = 64 - position + 1;
  }
  if (position !== tilePosition) {
    return position;
  }
  return tilePosition;
}

export function getHighlightedSquare(tile_pos) {
  return (
    <Square
      type={"highlight"}
      position={tile_pos}
      key={`highlight-square-${tile_pos}`}
    />
  );
}

export function getHoverSquare(tilePos) {
  return <HoverSquare position={tilePos} />;
}

export function getPromotePawn(promotionState, handlePromotion, playerColor) {
  return (
    <PromotePawn
      position={promotionState["position"]}
      onPromote={handlePromotion}
      playerColor={playerColor}
    />
  );
}

export function handlePawnMoves(attack_moves, board, tile_pos) {
  if (board.enpassant === "-") return [attack_moves, null];

  let col = board.enpassant.charCodeAt(0) - "a".charCodeAt(0);
  let row = 8 - parseInt(board.enpassant[1]);
  let enpassantPos = row * 8 + col + 1;

  let turn = board.turn;
  let [pawnRow, pawnCol] = getRowCol(tile_pos);
  console.log(enpassantPos);
  row++;
  col++;
  console.log(pawnRow === row - 1 && pawnCol === col - 1);
  console.log(pawnRow === row - 1 && pawnCol === col + 1);
  console.log(pawnRow, pawnCol, row, col);
  if (
    turn === "w" &&
    !(
      (pawnRow === row + 1 && pawnCol === col - 1) ||
      (pawnRow === row + 1 && pawnCol === col + 1)
    )
  ) {
    return [attack_moves, null];
  } else if (
    turn === "b" &&
    !(
      (pawnRow === row - 1 && pawnCol === col - 1) ||
      (pawnRow === row - 1 && pawnCol === col + 1)
    )
  ) {
    return [attack_moves, null];
  }
  return [attack_moves.concat(enpassantPos), enpassantPos];
}

export function handleCastling(
  piece,
  board,
  valid_moves,
  attack_moves,
  tile_pos
) {
  let checkIn = board.inCheckSpecific(piece.color);
  [valid_moves, attack_moves] = piece.validMoves(
    board.board,
    getRowCol(tile_pos),
    checkIn[0]
  );
  if (board.castling !== "-" && !checkIn[0]) {
    let castle = [];
    if (piece.color === 0 && board.castling.includes("K")) castle.push(63);
    if (piece.color === 0 && board.castling.includes("Q")) castle.push(59);
    if (piece.color === 1 && board.castling.includes("k")) castle.push(7);
    if (piece.color === 1 && board.castling.includes("q")) castle.push(3);
    return castle;
  }
  return null;
}

export const generateMoveableSquares = (attackMoves, validMovesList) => {
  return [
    ...attackMoves.map((pos) => (
      <Square type={"attackable"} position={pos} key={`attack-square-${pos}`} />
    )),
    ...validMovesList.map((pos) => (
      <Square type={"hint"} position={pos} key={`hint-square-${pos}`} />
    )),
  ];
};

export function updateBoard(b, playerColor) {
  const newVisualBoard = [];
  const pieceTypeMap = {
    Pawn: "pawn",
    Rook: "rook",
    Knight: "knight",
    Bishop: "bishop",
    King: "king",
    Queen: "queen",
  };
  for (let row = b.board.length - 1, i = 0; row >= 0; row--, i++) {
    let piece = b.board[i];
    let position = i + 1;
    if (piece !== ".") {
      let pieceType = pieceTypeMap[piece.type];
      let colorClass = piece.color === 0 ? "white" : "black";
      newVisualBoard.push(
        <Square
          type={`${pieceType} ${colorClass}`}
          position={position}
          playerColor={playerColor}
          key={position}
        />
      );
    }
  }
  return newVisualBoard;
}

export function getRowCol(position) {
  return [Math.floor((position - 1) / 8 + 1), ((position - 1) % 8) + 1];
}
