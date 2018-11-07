const express = require('express');
const bodyParser = require('body-parser');
const  app = express();
const  server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000, ()=>{
  console.log('port is listening');
});


// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}



io.on('connection', (socket)=>{
	console.log(socket.id);

	socket.on('SEND_MESSAGE', (data)=>{
		io.emit('RECEIVE_MESSAGE', data);

	})


});

