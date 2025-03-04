import PropTypes from "prop-types";
import { useState } from "react";

const StartMenu = ({ handleMultiplayer }) => {
  const handleButtonClick = async () => {
    await handleMultiplayer(name);
  };

  const [name, setName] = useState("");
  return (
    <main className="font-mono uppercase">
      <div className="flex w-full items-center justify-center py-12 lg:grid lg:min-h-[600px] xl:min-h-[800]px">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mx-auto grid w-[350px] gap-6 rounded-md border p-10">
            <div className="grid gap-2 text-center">
              <p className="w-full text-xl tracking-widest">Realtime</p>
              <p className="w-full font-bold text-3xl tracking-tighter">
                Chess.Online
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid gap-2">
                <label>Name</label>
                <input
                  id="name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer [&:user-invalid:not(:focus)]:border-red-500"
                  type="text"
                  placeholder="Enter your name"
                  minLength="1"
                  required=""
                  value={name}
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                ></input>
                <p className="hidden text-red-500 text-sm peer-invalid:block">
                  This Field Is Required
                </p>
              </div>
              <div className="grid mt-3">
                <button
                  className="text-white bg-black h-10 w-full border rounded-md hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                  disabled={!name.trim()}
                  onClick={handleButtonClick}
                >
                  <p>Play Multiplayer</p>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

StartMenu.propTypes = {
  handleMultiplayer: PropTypes.func.isRequired,
};

export default StartMenu;
