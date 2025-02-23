import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export default function useMultiplayer({ localScore, localFen }) {
  const [serverScore, setServerScore] = useState({ white: 0, black: 0 });
  const [serverFen, setServerFen] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [playOnline, setPlayOnline] = useState(false);

  useEffect(() => {
    if (localFen && localScore) {
      socket?.emit("update_game", { localFen: localFen, score: localScore });
    }
  }, [localFen, localScore]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setPlayOnline(true);
      });

      socket.on("waiting_for_opponent", () => {
        setOpponentName(null);
      });

      socket.on("found_opponent", (data) => {
        setOpponentName(data.opponentName);
        setPlayerColor(data.color);
      });

      socket.on("disconnect", () => {
        setPlayOnline(false);
        setOpponentName(null);
      });

      socket.on("get_server_state", (data) => {
        setServerFen(data.localFen);
        setScore(data.score);
        setCurrentTurn(data.localFen.split(" ")[1]);
      });
    }
  }, [socket]);

  async function handleMultiplayer() {
    console.log("handleMultiplayer: handleMultiplayer function called");
    const result = await getPlayerName();
    if (!result.isConfirmed) return;
    const newSocket = io("http://localhost:3000", { autoConnect: true });
    setPlayerName(result.value);
    newSocket?.emit("request_to_play", { name: result.value });
    setSocket(newSocket);
  }

  const getPlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter A Name:",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You must enter a name to play.";
        }
      },
    });
    return result;
  };

  return {
    handleMultiplayer,
    serverScore,
    serverFen,
    playerColor,
    playerName,
    opponentName,
    currentTurn,
    playOnline,
  };
}
