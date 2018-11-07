const express = require('express');
const bodyParser = require('body-parser');
const socketIo = require("socket.io");
const http = require("http");



let app = express();


const server = app.listen(8080, ()=> {
    console.log('server is running on port 8080')
});

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const io = socketIo(server);

io.on('connection', (socket)=>{
	console.log(socket.id);

	socket.on('SEND_MESSAGE', (data)=>{
		io.emit('RECEIVE_MESSAGE', data);

	})


});

