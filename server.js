"use strict";

console.log("更新開始");
console.log("aaa");

const express = require("express");
const socketIO = require("socket.io");

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

var userList = [];
var typingUsers = {};

io.on("connection", (socket) => {
  console.log("Client connected");

  //接続が切れたとき退出
  socket.on("disconnect", function () {
    console.log("Client disconnected");

    var clientNickname;
    for (var i = 0; i < userList.length; i++) {
      if (userList[i]["id"] == socket.id) {
        userList[i]["isConnected"] = false;
        clientNickname = userList[i]["nickname"];
        break;
      }
    }

    delete typingUsers[clientNickname];
    io.emit("userList", userList);
    io.emit("userExitUpdate", clientNickname);
    io.emit("userTypingUpdate", typingUsers);
  });

  socket.on("exitUser", function (clientNickname) {
    console.log("Client exit");
    for (var i = 0; i < userList.length; i++) {
      if (userList[i]["id"] == socket.id) {
        userList.splice(i, 1);
        break;
      }
    }
    io.emit("userExitUpdate", clientNickname);
  });

  socket.on("chatMessage", function (clientNickname, message) {
    var currentDateTime = new Date().toLocaleString();
    delete typingUsers[clientNickname];
    io.emit("userTypingUpdate", typingUsers);
    io.emit("newChatMessage", clientNickname, message, currentDateTime);
  });

  socket.on("trackingData", function (clientNickname, message) {
    delete typingUsers[clientNickname];
    io.emit("userTypingUpdate", typingUsers);
    io.emit(`${clientName}`, message);
  });

  socket.on("connectUser", function (clientNickname) {
    var message = "User " + clientNickname + " was connected.";
    console.log(message);

    var userInfo = {};
    var foundUser = false;
    for (var i = 0; i < userList.length; i++) {
      if (userList[i]["nickname"] == clientNickname) {
        userList[i]["isConnected"] = true;
        userList[i]["id"] = socket.id;
        userInfo = userList[i];
        foundUser = true;
        console.log("foundUser");
        break;
      }
    }
    //foundUserじゃないとき
    if (!foundUser) {
      userInfo["id"] = socket.id;
      userInfo["nickname"] = clientNickname;
      userInfo["isConnected"] = true;
      console.log("Not foundUser");
      //userListにuserInfoを追加
      userList.push(userInfo);
    }

    io.emit("userList", userList);
    console.log(userList);
    io.emit("userConnectUpdate", userInfo);
  });

  socket.on("startType", function (clientNickname) {
    console.log("User " + clientNickname + " is writing a message...");
    typingUsers[clientNickname] = 1;
    io.emit("userTypingUpdate", typingUsers);
  });

  socket.on("stopType", function (clientNickname) {
    console.log("User " + clientNickname + " has stopped writing a message...");
    delete typingUsers[clientNickname];
    io.emit("userTypingUpdate", typingUsers);
  });
});

//更新しました
