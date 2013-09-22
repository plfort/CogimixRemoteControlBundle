var socket;
var remoteConnected=false;
function makeToken(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var remoteToken = null;
$(document).ready(function(){
	
	$("#remoteShowDialogBtn").click(function(event){
		if(remoteToken == null) {
			remoteToken = makeToken();
			var remoteUrl = Routing.generate('_remote_control_page',{'token':remoteToken},true);
			$("#remoteQr").qrcode({'text':remoteUrl,width: 220,height: 220});
			$("#remoteLink").html(remoteUrl);
			
			
			socket = io.connect(nodeUrl+'?token='+remoteToken);
			socket.on('error',function(reason){
				  console.error('Unable to connect Socket.IO ', reason);

			});
			socket.on('connect',function(){
			    loggerRemote.debug('CONNECTED');
			    
		
			    socket.on('remoteControlEvent',function(data){
			        switch(data.action){
			           case playerEvent.stop: musicPlayer.stop();break;
			           case playerEvent.play: musicPlayer.play();break;
			           case playerEvent.pause: musicPlayer.pause();break;
			           case playerEvent.next: musicPlayer.next();break;
			           case playerEvent.previous: musicPlayer.previous();break;
			        }
				 });
			    socket.on('remoteConnected',function(data){
			    	remoteConnected = true;
			    	addSuccessMessage("Remote connected !");
			    	emit('init',{
			    		'currentPlaylist':musicPlayer.linkedPlaylist.getSongsArray(),
			    		'playlistOptions':musicPlayer.playlistOptions,
			    		'volume':musicPlayer.volume,
			    		'currentTrack': musicPlayer.getCurrrentTrack(),
			    		});
			    	
			    });
			    
			    socket.on('controlChanged',function(data){
			    
			    	switch(data.event){
			    	
		    			case 'shuffleEnabled':	musicPlayer.enableShuffle();break;
		    			case 'shuffleDisabled':	musicPlayer.disableShuffle();break;
		    			case 'repeatAllEnabled':	musicPlayer.enableRepeatAll();break;
		    			case 'repeatAllDisabled':	musicPlayer.disableRepeatAll();break;
		    		
		    	 }
			    	
			    });
			    
			    socket.on(cogimixPlayerEvents.volumeChanged,function(data){
			    	console.log('receive volume change');
			    	musicPlayer.setVolume(data.volume);
			    	
			    });
			    
			    socket.on(cogimixPlayerEvents.changeOrder,function(data){
			    	console.log('receive changeOrder');
			    	console.log(data);
			    	musicPlayer.changeOrder(data.oldIdx,data.newIdx,true);
			    	
			    });
			    
			    socket.on('remoteDisconnected',function(data){
			    	remoteConnected = false;
			    	addErrorMessage("Remote disconnected");
			    	
			    	
			    });
			    
			    socket.on('playQueueItem',function(data){
			    	loggerRemote.debug('Remote control, playQueueItem');
			    	loggerRemote.debug(data);
			    	
			    		musicPlayer.play(data.id);
			    	});
			    
			    socket.on('cursorUpdate',function(data){
			    	loggerRemote.debug('Remote control, cursorUpdate');
			    	//loggerRemote.debug(data);
			    	
			    		musicPlayer.seekTo(data.currentTime);
			    	});

			    
			    $.each(cogimixPlayerEvents,function(id,value){
			    	
			    	 $(document).on(value,function(event,data){
			    		 if(value !=cogimixPlayerEvents.cursorUpdate ){
			    			 console.log(event);
			    			 console.log(data);
			    		 }
					    		emit(value,data);
					    });
			    });
			   
			    
			  /*  $(document).on('cogimix_play',function(event,data){
			    	loggerRemote.debug('event cogimix play');
			    	loggerRemote.debug(data);
			       emit('cogimix_play',data);
			    });*/
			    socket.on('disconnect',function(){
			    	loggerRemote.debug('DISCONNECTED');
			    	
			    	 $.each(cogimixPlayerEvents,function(id,value){
				    	 $(document).off(value);
			    	 });
				  
			    /*	$(document).off('cursorUpdate');
			    	$(document).off('cogimix_play');*/
			    });
			});
			
		}
		$("#remoteScanModal").modal("toggle");
	}).tooltip({placement:'bottom'});
	


});

function emit(eventName,data){
	if(socket != null && remoteConnected == true){
		socket.emit(eventName,data);
	}
}