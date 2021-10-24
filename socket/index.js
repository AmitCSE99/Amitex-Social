const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (newUser, socketId) => {
  !onlineUsers.some((user) => user._id === newUser._id) &&
    onlineUsers.push({
      user: newUser,
      socketId,
      notifications: 0,
      likedBy: [],
    });
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.user._id === userId);
};

io.on("connection", (socket) => {
  // ...

  socket.on("newUser", (newUser) => {
    addNewUser(newUser, socket.id);
    console.log(onlineUsers);
  });

  socket.on("clearNotifications", (userId) => {
    const user = getUser(userId);
    user.notifications = 0;
    user.likedBy = [];
    console.log(user);
  });

  socket.on("sendNotification", ({ senderId, receiverId, type }) => {
    const receiver = getUser(receiverId);
    console.log(senderId);
    if (!receiver.likedBy.includes(senderId)) {
      receiver.notifications += 1;
      receiver.likedBy.push(senderId);
      const newNotifications = receiver.notifications;
      io.to(receiver.socketId).emit("getNotification", {
        senderId,
        type,
        newNotifications,
      });
    }
  });

  console.log("Someone Has Connected!");
  socket.on("disconnect", () => {
    console.log("Someone has Left!");
    removeUser(socket.id);
    console.log(onlineUsers);
  });
});

io.listen(8080);
