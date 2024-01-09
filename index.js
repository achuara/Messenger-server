import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

//import {Server} from 'socket.io';
//import http from 'http';
import cors from 'cors';

import userRoutes from './routes/users.js';

import conversationsRoutes from './routes/conversations.js';
import messagesRoutes from './routes/messages.js';



const app = express();
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

/*const server = http.createServer(app);
const io = new Server(8080, {
  cors: {
    origin: "http://localhost:3000",
  },
});*/

const CONNECTION_URL = "mongodb+srv://sumankumar21041999:social123@cluster1.vigicqk.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT|| 5000;


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });

 // .then(() => server.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  //.catch((error) => console.log(`${error} did not connect to database`));

mongoose.set('useFindAndModify', false);

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chat-client-gilt-gamma.vercel.app",
    // credentials: true,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  //console.log("adduser fun");

  //console.log(userId);
  //console.log(socketId);
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
    //console.log(users);

};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  //console.log("getuser fun");
  //console.log(users.find((user) => user.userId === userId));
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  //console.log("a user connected through socket.");
  

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      //get user not working
      const user = getUser(receiverId);
      
    //  console.log(senderId);
    //  console.log(receiverId);

      //console.log("user.socketId "+user.socketId);

      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });


   //when disconnect
  socket.on("disconnect", () => {
    //console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });



});

app.use('/user', userRoutes);

app.use('/conversations', conversationsRoutes);
app.use('/messages', messagesRoutes);

app.get('/user/online/:userId', (req, res) => {
  
  const { userId } = req.params;

  //console.log("online user!");

  if(users.find((user) => user.userId === userId)){
   // console.log("online");
    res.status(200).send(true);

  }
  else{
    //console.log("offline");
    res.status(200).send(false);
  }

  //console.log("online user!"); 
 
});








