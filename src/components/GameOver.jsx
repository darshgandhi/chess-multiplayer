import "../styles/GameOver.css";

const GameOver = ({
  setShowPlayAgain,
  setOpponentDisconnected,
  showPlayAgain,
  Winner,
  Type,
}) => {
  return (
    <div className="gameover">
      <h2 className="title">
        Game Over:{" "}
        {showPlayAgain ? `${Winner} Wins by ${Type}!` : "Opponent Disconnected"}
      </h2>
      <button
        className="exit-button"
        onClick={() => {
          setShowPlayAgain(false);
          setOpponentDisconnected(false);
        }}
      >
        Exit
      </button>
    </div>
  );
};

export default GameOver;
