const express = require('express');
const bodyParser = require('body-parser');
const  app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;
const Chat = require('./config/db');
const router = express.Router();




// mongoose.connect(dbRoute, {useNewUrlParser:true});
if (process.env.NODE_ENV === 'production') {

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

  socket.broadcast.emit('user connected');


});

app.use("/api", router);

http.listen(PORT,function(){
  console.log('listening on port %s',PORT);
});

