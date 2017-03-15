var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;



 /* serves main page */
 app.get("/", function(req, res) {
    res.sendFile(__dirname +'/public/index.html')
 });
 
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendFile( __dirname + '/public/' + req.params[0]); 
 });

io.on('connection', function(socket){
    console.log('new connection', socket.id);
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);
      
        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
        
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");
      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});