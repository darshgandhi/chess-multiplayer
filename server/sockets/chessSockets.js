const allUsers = {};
const allRooms = [];

export function setupSocketEvents(io) {
  io.on("connection", (socket) => {
    if (allUsers[socket.id]) {
      allUsers[socket.id].online = true;
    } else {
      allUsers[socket.id] = { socket: socket, online: true };
    }

    socket.on("player_resigned", () => {
      for (let i = 0; i < allRooms.length; i++) {
        const { player1, player2 } = allRooms[i];
        if (player1.socket.id === socket.id) {
          player2.socket.emit("opponent_resigned_match");
        } else if (player2.socket.id === socket.id) {
          player1.socket.emit("opponent_resigned_match");
        }
      }
    });

    socket.on("player_wins", (data) => {
      for (let i = 0; i < allRooms.length; i++) {
        const { player1, player2 } = allRooms[i];
        if (player1.socket.id === socket.id) {
          player2.socket.emit("game_over", data);
        }
        if (player2.socket.id === socket.id) {
          player1.socket.emit("game_over", data);
        }
      }
    });

    socket.on("request_to_play", (data) => {
      const currentUser = allUsers[socket.id];
      currentUser.name = data.name;
      const opponentUser = Object.values(allUsers).find(
        (user) => user.online && user.name !== currentUser.name
      );

      if (opponentUser) {
        const colors = ["w", "b"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        allRooms.push({ player1: opponentUser, player2: currentUser });

        opponentUser.socket.emit("found_opponent", {
          opponentName: currentUser.name,
          color: color,
        });
        currentUser.socket.emit("found_opponent", {
          opponentName: opponentUser.name,
          color: color === "w" ? "b" : "w",
        });
        currentUser.online = false;
        opponentUser.online = false;

        currentUser.socket.on("update_game", (data) => {
          opponentUser.socket.emit("get_server_state", {
            localFen: data.localFen,
            score: data.score,
          });
        });
        opponentUser.socket.on("update_game", (data) => {
          currentUser.socket.emit("get_server_state", {
            localFen: data.localFen,
            score: data.score,
          });
        });
      } else {
        currentUser.socket.emit("waiting_for_opponent");
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected User: ", socket.id);
      for (let i = 0; i < allRooms.length; i++) {
        const { player1, player2 } = allRooms[i];
        if (player1.socket.id === socket.id) {
          player2.socket.emit("opponent_left_match");
        }
        if (player2.socket.id === socket.id) {
          player1.socket.emit("opponent_left_match");
        }
      }
      if (allUsers[socket.id]) {
        delete allUsers[socket.id];
      }
    });
  });
}
