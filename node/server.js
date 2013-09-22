var tokenBrowser={};
var tokenMobile={};
var fs = require('fs');
var settings = require('yaml-config').readConfig('./config/app.yaml');
var express = require('express');
if(process.env.NODE_ENV=='dev'){
	var app = express.createServer();
}else{
	var options = {
			  ca:   fs.readFileSync(settings.ssl.ca),
			  key:  fs.readFileSync(settings.ssl.key),
			  cert: fs.readFileSync(settings.ssl.cert)
			};
	var app = express.createServer(options);
}
var io = require('socket.io').listen(8000);

io.configure(function(){
	io.set('log level', 2);	
});

io.of('/browser').authorization(function (handshakeData, callback) {
	  
	  if(handshakeData.query.token){
		  console.log('------- Token '+handshakeData.query.token+' -------');
		  handshakeData.token=handshakeData.query.token;
		  callback(null, true);
	  }else{
		  callback(null, false);
	  }
	})
	.on('connection', function (socket) {
		
		console.log('------- Browser connection -------');
		var token = socket.handshake.token;
		tokenBrowser[token] = socket.id;
		/*socket.on('playerEvent',function(data){
			if(token in tokenMobile){
				io.of('/mobile').socket(tokenMobile[token]).emit('playerEvent',data);
			}else{
				console.log("token mobile not here playerEvent");
			}
			
		});*/
		socket.on('init',function(data){
			if(token in tokenMobile){
				io.of('/mobile').socket(tokenMobile[token]).emit('init',data);
			}
			
		});
		socket.on('playbackEvent',function(data){
			if(token in tokenMobile){
				io.of('/mobile').socket(tokenMobile[token]).emit('playbackEvent',data);
			}
			
		});
		socket.on('controlChanged',function(data){
			
			io.of('/mobile').socket(tokenMobile[token]).emit('controlChanged',data);
		});
		socket.on('removeSongFromQueue',function(id){
			
			io.of('/mobile').socket(tokenMobile[token]).emit('removeSongFromQueue',id);
		});
		
		socket.on('removeAllSongsFromQueue',function(data){
			
			io.of('/mobile').socket(tokenMobile[token]).emit('removeAllSongsFromQueue',data);
		});
		
		socket.on('songsAdded',function(data){
		
			io.of('/mobile').socket(tokenMobile[token]).emit('songsAdded',data);
		});
		
		socket.on('currentPlaylist',function(data){
			if(token in tokenMobile){
				io.of('/mobile').socket(tokenMobile[token]).emit('currentPlaylist',data);
			}
			
		});
		
		socket.on('cursorUpdate',function(data){
			if(token in tokenMobile){
				io.of('/mobile').socket(tokenMobile[token]).emit('cursorUpdate',data);
			}
			
		});
		
		socket.on('changeOrder',function(data){
			//console.log(data);
			if(token in tokenMobile){
				io.of('/mobile').socket(tokenMobile[token]).emit('changeOrder',data);
			}
			
		});
		
		socket.on('volumeChanged',function(data){
			if(token in tokenMobile){
				io.of('/mobile').socket(tokenMobile[token]).emit('volumeChanged',data);
			}
			
		});
		
		socket.on('disconnect',function(data){
			console.log("Browser disconnected");
			delete tokenBrowser[token];
			if(token in tokenMobile){
				io.of('/mobile').socket(tokenMobile[token]).emit('disconnect');
			}
		});
	});

io.of('/mobile').authorization(function (handshakeData, callback) {
	  if(handshakeData.query.token){
		  handshakeData.token=handshakeData.query.token;
		  callback(null, true);
	  }else{
		  callback(null, false);
	  }
	})
	.on('connection', function (socket) {
		console.log('Mobile connection');
		var token = socket.handshake.token;
		tokenMobile[token] = socket.id;
		
		io.of('/browser').socket(tokenBrowser[token]).emit('remoteConnected');
		
		socket.on('remoteControlEvent',function(data){
			
			io.of('/browser').socket(tokenBrowser[token]).emit('remoteControlEvent',data);
		});
		
		socket.on('playQueueItem',function(data){
			if(token in tokenBrowser){
				io.of('/browser').socket(tokenBrowser[token]).emit('playQueueItem',data);
			}
			
		});
		
		
		socket.on('volumeChanged',function(data){
			if(token in tokenBrowser){
				io.of('/browser').socket(tokenBrowser[token]).emit('volumeChanged',data);
			}
			
		});
		
		socket.on('cursorUpdate',function(data){
			if(token in tokenBrowser){
				io.of('/browser').socket(tokenBrowser[token]).emit('cursorUpdate',data);
			}
			
		});
		
		socket.on('controlChanged',function(data){
			
			if(token in tokenBrowser){
				io.of('/browser').socket(tokenBrowser[token]).emit('controlChanged',data);
			}
		});
		
		socket.on('changeOrder',function(data){
			if(token in tokenBrowser){
				io.of('/browser').socket(tokenBrowser[token]).emit('changeOrder',data);
			}
		});
		
		socket.on('disconnect',function(data){
			delete tokenMobile[token];
			if(token in tokenBrowser){
				io.of('/browser').socket(tokenBrowser[token]).emit('remoteDisconnected');
			}
			
		});
		
	});
	