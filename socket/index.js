const { Server } = require("socket.io");

const PORT = process.env.PORT || 8080;

const io = new Server({
  cors: {
    origin: ["http://localhost:3000", "https://amitex-social.netlify.app"],
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
      commentedBy: [],
      requests: [],
    });
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.user._id === userId);
};

io.on("connection", (socket) => {
  console.log("The Online Users are: ", onlineUsers);
  socket.on("newUser", (newUser) => {
    addNewUser(newUser, socket.id);
    console.log(onlineUsers);
  });

  socket.on("clearNotifications", (userId) => {
    const user = getUser(userId);
    if (user) {
      user.notifications = 0;
      user.likedBy = [];
      console.log(user);
    }
  });

  socket.on("clearRequestNotifications", (userId) => {
    const user = getUser(userId);
    if (user) {
      user.requests = [];
      console.log(user);
    }
  });

  socket.on("sendNotification", ({ senderId, receiverId, type }) => {
    const receiver = getUser(receiverId);
    console.log(senderId);
    if (receiver && type === 1 && !receiver.likedBy.includes(senderId)) {
      receiver.notifications += 1;
      receiver.likedBy.push(senderId);
      const newNotifications = receiver.notifications;
      io.to(receiver.socketId).emit("getNotification", {
        senderId,
        type,
        newNotifications,
      });
    } else if (
      receiver &&
      type === 2 &&
      !receiver.commentedBy.includes(senderId)
    ) {
      receiver.notifications += 1;
      receiver.commentedBy.push(senderId);
      const newNotifications = receiver.notifications;
      io.to(receiver.socketId).emit("getNotification", {
        senderId,
        type,
        newNotifications,
      });
    } else if (
      receiver &&
      type === 3 &&
      !receiver.requests.includes(senderId)
    ) {
      receiver.notifications += 1;
      receiver.requests.push(senderId);
      console.log("Updated Requests list ", receiver.requests);
      const newNotifications = receiver.notifications;
      console.log(receiver.requests);
      io.to(receiver.socketId).emit("getNotification", {
        senderId,
        type,
        newNotifications,
      });
      io.to(receiver.socketId).emit("getRequestNotification", {
        requestList: receiver.requests,
        type,
        newRequestNotifications: receiver.requests.length,
      });
    } else if (receiver && type === 3 && receiver.requests.includes(senderId)) {
      receiver.notifications -= 1;
      receiver.requests = receiver.requests.filter(
        (request) => request !== senderId
      );
      const newNotifications = receiver.notifications;

      io.to(receiver.socketId).emit("getNotification", {
        senderId,
        type,
        newNotifications,
      });
      io.to(receiver.socketId).emit("getRequestNotification", {
        requestList: receiver.requests,
        type,
        newRequestNotifications: receiver.requests.length,
      });
    }
  });

  console.log("Someone Has Connected!");
  socket.on("disconnect", () => {
    console.log("Someone has Left!");
    removeUser(socket.id);
    console.log("The Online Users are: ", onlineUsers);
  });
});

io.listen(PORT);
