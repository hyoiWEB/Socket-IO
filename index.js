var http = require("http");
var server = http.createServer(function(req,res) {
    res.write("Hello World!!");
    res.end();
});

// socket.ioの準備
var io = require('socket.io')(server);

// クライアント接続時の処理
io.on('connection', function(socket) {
    console.log("client connected!!")

    // クライアント切断時の処理
    socket.on('disconnect', function() {
        console.log("client disconnected!!")
    });
    // クライアントからの受信を受ける (socket.on)
    socket.on("from_client", function(obj){
        console.log(obj)
        socket.emit("from_server",obj);
    });
});


server.listen(8080);