const express = require('express');
const bodyParser = require('body-parser');
const  app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;




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

http.listen(PORT,function(){
  console.log('listening on port %s',PORT);
});

