import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function useMultiplayer({
  localScore,
  localFen,
  playerResign,
  setEndReason,
  winReason,
}) {
  const [serverScore, setServerScore] = useState({ white: 0, black: 0 });
  const [serverFen, setServerFen] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [playOnline, setPlayOnline] = useState(false);

  useEffect(() => {
    if (localFen && localScore && socket) {
      socket?.emit("update_game", { localFen: localFen, score: localScore });
    }
  }, [localFen, localScore, socket]);

  useEffect(() => {
    if (playerResign && socket) {
      socket?.emit("player_resigned");
    }
  }, [playerResign, socket]);

  useEffect(() => {
    if (winReason && socket) {
      socket?.emit("player_wins", winReason);
    }
  }, [winReason, socket]);

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
        setServerFen(
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        );
        setServerScore({ white: 0, black: 0 });
      });

      socket.on("disconnect", () => {
        setCurrentTurn("w");
        setSocket(null);
        setPlayOnline(false);
      });

      socket.on("get_server_state", (data) => {
        setServerFen(data.localFen);
        setServerScore(data.score);
        setCurrentTurn(data.localFen.split(" ")[1]);
      });

      socket.on("opponent_left_match", () => {
        if (!playerResign || !winReason) {
          setPlayOnline(false);
          setEndReason({ reason: "Opponent left", message: "You Win!" });
        }
      });

      socket.on("opponent_resigned_match", () => {
        if (!playerResign || !winReason) {
          setPlayOnline(false);
          setEndReason({ reason: "Opponent Resigned", message: "You Win!" });
        }
      });

      socket.on("game_over", (data) => {
        setPlayOnline(false);
        setEndReason({
          reason: data.type,
          message: data.winner,
        });
      });
    }
  }, [socket]);

  function handleMultiplayer(name) {
    setOpponentName(null);
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      autoConnect: true,
    });
    setPlayerName(name);
    newSocket?.emit("request_to_play", { name: name });
    setSocket(newSocket);
  }

  return {
    handleMultiplayer,
    serverScore,
    serverFen,
    playerColor,
    playerName,
    opponentName,
    currentTurn,
    playOnline,
    socket,
    setOpponentName,
  };
}
