const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // ...
  console.log("Someone Has Connected!");
  socket.on("disconnect", () => {
    console.log("Someone has Left!");
  });
});

io.listen(8080);
