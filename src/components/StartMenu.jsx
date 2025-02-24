import PropTypes from "prop-types";

const StartMenu = ({ handleMultiplayer }) => {
  const handleButtonClick = async () => {
    console.log("Button Clicked");
    await handleMultiplayer();
  };
  return (
    <div className="start-menu">
      <h1 className="title">Welcome To Chess</h1>
      <button className="multiplayer-button" onClick={handleButtonClick}>
        <p data-title="Play Multiplayer" data-text="Start!"></p>
      </button>
      <button className="ai-button">
        <p data-title="Play vs AI" data-text="Start!"></p>
      </button>
    </div>
  );
};

StartMenu.propTypes = {
  handleMultiplayer: PropTypes.func.isRequired,
};

export default StartMenu;
