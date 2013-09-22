var socket;

function showPlayBtn(show){
	if(show == true){
		$cogimixRemote.playBtn.show();
		$cogimixRemote.pauseBtn.hide();
	}else{
		$cogimixRemote.playBtn.hide();
		$cogimixRemote.pauseBtn.show();
	}
		
}

function setVolume(value){


	    console.log("setvolume "+value);
		
		if($cogimixRemote.volumeSlider.hasClass('ui-slider-input')){
			$cogimixRemote.volumeSlider.val(value).slider('refresh');
		}else{
			$cogimixRemote.volumeSlider.attr('value',value);
		}
	
}

function activateRepeatAllBtn(activate){
	if(activate == true){
		$cogimixRemote.repeatAllBtn.addClass('active')
	}else{
		$cogimixRemote.repeatAllBtn.removeClass('active')
	}	
}

function activateShuffleBtn(activate){
	if(activate == true){
		$cogimixRemote.shuffleBtn.addClass('active')
	}else{
		$cogimixRemote.shuffleBtn.removeClass('active')
	}	
}

$(document).on('pageinit',function(){
	
	window.$cogimixRemote = {
			currentPlaylist : $("#currentPlaylist"),
			title :   $("#title"),
			playBtn : $("#playBtn"),
			pauseBtn : $("#pauseBtn"),
			nextBtn : $("#nextBtn"),
			prevBtn : $("#previousBtn"),
			shuffleBtn : $("#shuffleBtn"),
			repeatAllBtn : $("#repeatAllBtn"),
			cursor : $("#cursor"),
			volumeSlider : $("#volumeSlider")
	};

	showPlayBtn(true);
	$cogimixRemote.currentPlaylist.sortable({
			handle:'.sort-handle',
			start : function(event, ui) {			
				$(ui.item).data("startindex", ui.item.index());
			},
			axis: "y",
			scroll : false,
			containment: 'document',
			appendTo: 'body',
			stop : function(event, ui) {
				var index=ui.item.index();
				var startIndex = ui.item.data('startindex');
				if(socket != null){
					socket.emit(cogimixPlayerEvents.changeOrder,{'oldIdx':startIndex,'newIdx':index});
				}
			},
	});
	
	$cogimixRemote.cursor.on( "slidestart", function( event, ui ) {
		
		$(this).data('sliding',true);
	} ).on( "slidestop", function( event, ui ) {
		$(this).data('sliding',false);
		
		if(socket != null){
			socket.emit('cursorUpdate',{'currentTime':$(this).val()});
		}
	} ).data('sliding',false);
	
	
	$cogimixRemote.volumeSlider
		.on( "slidestart", function( event, ui ) {
			$(this).data('sliding',true);
			console.log('Volume start sliding');
		}).on("slidestop", function( event, ui ) {
			$(this).data('sliding',false);
			console.log('Volume stop sliding');
			if(socket != null){
				console.log('emit volume');
				socket.emit(cogimixPlayerEvents.volumeChanged,{'volume':$(this).val()});
		}
	} ).data('sliding',false);
	
	socket = io.connect(nodeUrl+'?token='+token);
	socket.on('error',function(reason){
		  console.error('Unable to connect Socket.IO ', reason);

	});
	socket.on('connect',function(){
	   
		$cogimixRemote.pauseBtn.click(function(event){
		    socket.emit('remoteControlEvent', {'action' : playerEvent.pause});
		    showPlayBtn(true);
		});
	    $cogimixRemote.playBtn.click(function(event){
	    	 socket.emit('remoteControlEvent', {'action' : playerEvent.play});
	    	 showPlayBtn(false);
		    });
	    $cogimixRemote.nextBtn.click(function(event){
		    socket.emit('remoteControlEvent', {'action' : playerEvent.next});
		    });
	    $cogimixRemote.prevBtn.click(function(event){
	    	 socket.emit('remoteControlEvent', {'action' : playerEvent.previous});
		    });
	    
	    $cogimixRemote.repeatAllBtn.click(function(event){
	    	if($cogimixRemote.repeatAllBtn.hasClass('active')){
	    		 activateRepeatAllBtn(false);
	    		 socket.emit('controlChanged', {'event' : 'repeatAllDisabled'});
	    	}else{
	    		activateRepeatAllBtn(true);
	    		socket.emit('controlChanged', {'event' : 'repeatAllEnabled'});
	    	}
	    	
		 });
	    
	    $cogimixRemote.shuffleBtn.click(function(event){
	    	if($cogimixRemote.shuffleBtn.hasClass('active')){
	    		 activateShuffleBtn(false);
	    		 socket.emit('controlChanged', {'event' : 'shuffleDisabled'});
	    	}else{
	    		activateShuffleBtn(true);
	    		socket.emit('controlChanged', {'event' : 'shuffleEnabled'});
	    	}
	    	
		 });
	    
	    socket.on(cogimixPlayerEvents.cursorUpdate,function(data){
	    	if($cogimixRemote.cursor.data('sliding') == false){
	    		$cogimixRemote.cursor.attr('max',data.totalTime).val(data.currentTime).slider('refresh');
	    	}
 	   });
	    $cogimixRemote.currentPlaylist.on('click','li a',function(event){
	    	var clickedItemId =$(this).attr('id');
	    	console.log('item clicked '+clickedItemId);
	    	socket.emit('playQueueItem', {'id' : clickedItemId});
			return false;
		});
	    
	    socket.on(cogimixPlayerEvents.removeSongFromQueue,function(data){
	    	console.log(data.id);
	    	$cogimixRemote.currentPlaylist.find('#'+data.id).closest('li').remove();
	    	$cogimixRemote.currentPlaylist.listview('refresh');
	    });
	    
	    socket.on(cogimixPlayerEvents.removeAllSongsFromQueue,function(data){
	    	
	    	$cogimixRemote.currentPlaylist.empty().listview('refresh');
	
	    });
	    
	    socket.on(cogimixPlayerEvents.volumeChanged,function(data){
	    	
	    	setVolume(data.value);
	    
	    });
	    
	    socket.on(cogimixPlayerEvents.controlChanged,function(data){
	    	
	    	switch(data.event){
	    	
	    		case cogimixControlEvents.shuffleEnabled: activateShuffleBtn(true)	;break;
	    		case cogimixControlEvents.shuffleDisabled:	activateShuffleBtn(false);break;
	    		case cogimixControlEvents.hidePlay:	showPlayBtn(false);break;
	    		case cogimixControlEvents.showPlay:	showPlayBtn(true);break;
	    		case cogimixControlEvents.repeatAllEnabled:	activateRepeatAllBtn(true);break;
	    		case cogimixControlEvents.repeatAllDisabled:	activateRepeatAllBtn(false);break;
	    		
	    	}
	    
	    });
	    
	    socket.on(cogimixPlayerEvents.songsAdded,function(data){
	    	console.log(data);
	    	var playlistHtml = '';

	    	$.each(data.songs, function(id, track) {
	    		console.log('render');
	    		console.log(track);
	    		playlistHtml += render('trackItem', {
	    			'track' : track,
	    		});
	
	    	});

	    	if('idx' in data){
	    		if(data.idx == 0){
	    			$cogimixRemote.currentPlaylist.prepend(playlistHtml);
	    		}else{
	    			if(data.idx >= $cogimixRemote.currentPlaylist.children('li').size()){
	    				$cogimixRemote.currentPlaylist.append(playlistHtml);
	    			}else{
	    				$cogimixRemote.currentPlaylist.find('li:nth-child('+(data.idx)+')').after(playlistHtml);
	    			}
	    			
	    		}
	    		
	    	}else{
	    		if('afterId' in data){
	    			$cogimixRemote.currentPlaylist.find('#'+data.afterId).closest('li').after(playlistHtml);
	    			
	    		}else{
	    			$cogimixRemote.currentPlaylist.append(playlistHtml);
	    		}
	    	}
	    	$cogimixRemote.currentPlaylist.listview('refresh');
	    
	    });
	    
	    socket.on(cogimixPlayerEvents.changeOrder,function(data){
	    	console.log(data);
	    	var $elem = $cogimixRemote.currentPlaylist.find('li:nth-child('+(data.oldIdx+1)+')');
	    	console.log($elem);
	    	var $clone = $elem.clone();
	    	if(data.newIdx == 0){
	    		$cogimixRemote.currentPlaylist.prepend($clone);
	    	}else {
	    		if(data.newIdx>data.oldIdx){
	    			$clone.insertAfter($cogimixRemote.currentPlaylist.find('li:nth-child('+(data.newIdx+1)+')'));
	    		}else{
	    			$clone.insertAfter($cogimixRemote.currentPlaylist.find('li:nth-child('+(data.newIdx)+')'));
	    		}
	    		
	    		
	    	}
	    	$elem.remove();
	    	console.log($clone);
	    	$cogimixRemote.currentPlaylist.listview('refresh');
	    });
	    
	    
	    socket.on('init',function(data){
	    	console.log('init');
	    	console.log(data.currentPlaylist);
	    	var playlistHtml = '';

	    	$.each(data.currentPlaylist, function(id, track) {

	    		playlistHtml += render('trackItem', {
	    			'track' : track,
	    		});

	    	});
	    	setVolume(data.volume);
	    	$cogimixRemote.currentPlaylist.html(playlistHtml).listview('refresh');
	    	activateRepeatAllBtn(data.playlistOptions.repeatAll);
	    	activateShuffleBtn(data.playlistOptions.shuffle);
	    	if(data.currentTrack != null ){
	    		setCurrentTrack(data.currentTrack.id, data.currentTrack.title,data.currentTrack.artist);
	    	}
		   });
	    
	    socket.on('currentPlaylist',function(data){
	    	console.log('currentPlaylist');
	    	var playlistHtml = '';

	    	$.each(data, function(id, track) {

	    		playlistHtml += render('trackItem', {
	    			'track' : track,
	    		});

	    	});
	    	$cogimixRemote.currentPlaylist.html(playlistHtml).listview('refresh');
	      
		   });
	    socket.on(cogimixPlayerEvents.playbackEvent,function(data){
	    	switch(data.event){
	    	case cogimixPlaybackEvents.play :
	    		console.log('cogimix_play');
		    	console.log('#'+data.currentTrack.id);
		    	setCurrentTrack(data.currentTrack.id, data.currentTrack.title,data.currentTrack.artist);
		    	/*$cogimixRemote.currentPlaylist.children().removeClass('current');
		      
		        $cogimixRemote.title.html(data.currentTrack.title);
		        $cogimixRemote.currentPlaylist.find('a#'+data.currentTrack.id).closest('li').addClass('current');
		        */
		        break;
	    	}
	    	
		   });
		});

});

function setCurrentTrack(id,title,artist){
	$cogimixRemote.currentPlaylist.children().removeClass('current');
	 $cogimixRemote.title.html(artist+' - '+title);
     $cogimixRemote.currentPlaylist.find('a#'+id).closest('li').addClass('current');
}