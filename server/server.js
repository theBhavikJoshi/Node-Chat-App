const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname , '../public');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(publicPath));

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User Connected');
    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the Chat App'));

    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New User Joined the Chat App'));

    socket.on('createMessage', (message) => {
        console.log('Create Message ' , message);

        io.emit('newMessage', generateMessage(message.from, message.text));

    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect' , () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});