import "../styles/Square.css";

function PromotePawn({ position, onPromote, playerColor }) {
  const handlePromotion = (e) => {
    const piece = e.target.getAttribute("data-piece");
    onPromote(piece);
  };

  return (
    <div
      style={playerColor === "b" ? { transform: "rotate(180deg)" } : {}}
      className={`square-${position}`}
    >
      <div className="promotion-container" onMouseDown={handlePromotion}>
        <div
          className={`promotion-choice queen${
            playerColor === "b" ? " black" : ""
          }`}
          data-piece="queen"
        ></div>
        <div
          className={`promotion-choice rook${
            playerColor === "b" ? " black" : ""
          }`}
          data-piece="rook"
        ></div>
        <div
          className={`promotion-choice bishop${
            playerColor === "b" ? " black" : ""
          }`}
          data-piece="bishop"
        ></div>
        <div
          className={`promotion-choice knight${
            playerColor === "b" ? " black" : ""
          }`}
          data-piece="knight"
        ></div>
      </div>
    </div>
  );
}

export default PromotePawn;
