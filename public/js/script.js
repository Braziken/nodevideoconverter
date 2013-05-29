$(document).ready(function(){

	var init = function (){
		$('.progress').hide();

		$('.preload').addClass('hide');
		$('.message').addClass('hide');
		$('#videocontainer').hide();
		$('.message span').text('');
	}

	var loadPlayer = function (videoFiles){
		console.log(JSON.stringify(videoFiles));
		$('#videocontainer').show('fast');

		$('.videoOgg').attr('href', videoFiles[0].ogg);
		$('.videoWebm').attr('href', videoFiles[0].webm);
		$('.videoMp4').attr('href', videoFiles[0].mp4);

		if($("#videoplayer").data().flowplayer){
			$("#videoplayer").data().flowplayer.unbind();	
		}
		
		$("#videoplayer").flowplayer({
			playlist: [videoFiles]
		});
	}
	window.loadPlayer = loadPlayer;


	$( "#btn_submit" ).bind( "click", function(e) {
		e.preventDefault();

		if($('#file').val() == '' ){
			return;
		}

		startUpload();

		var formData = new FormData($('#fileupload')[0]);

		$.ajax({
			url: 'file/upload',
			type: 'POST', xhr: function() { 
				var ajaxXhr = $.ajaxSettings.xhr();
				if(ajaxXhr.upload){
					ajaxXhr.upload.addEventListener('progress',progressFn, false); 
							//handling the progress of the upload
						}
						return ajaxXhr;
					},

					success: successFn,
					error: errorFn,

					data: formData,

					cache: false,
					contentType: false,
					processData: false
				});


		function startUpload (){
			$('.progress').show('fast');
			$('.progress .bar').attr('style', 'width : 0');
			$('.preload').hide('fast');
			$('#videocontainer').hide('fast');
			$('.message span').text('');
		}

		function progressFn(e){
			if(e.lengthComputable){
				$('.progress').removeClass('hide');
				var progress = (e.loaded/e.total) *100;
				console.log(Math.round(progress));
				$('.progress .bar').attr('style', 'width : ' + (Math.round(progress) +'%'));
				console.log({value:e.loaded,max:e.total});

				if(e.loaded >= e.total){
					$('.preload').show();
					$('.progress').hide();
				}
			}
		}

		function successFn(data){
			
			if(data.errors){
				console.log('Upload errors: ', data);
				showMessage('Upload errors: ' + data.errors[0], 'error');

				$('.preload').hide('slow');
				
				return data.errors[0];
			}
			var videoSources = [];
			var videoObj = {};

			if(data.hasOwnProperty(outputs)){
				for(var i=0; i<data.outputs.length; i++){
					videoObj[data.outputs[i].label] = data.outputs[i].url;
					videoSources.push(videoObj);
				}	
			}else{
				showMessage('Error on conversion: '+ data, 'error');	
			}

			console.log(['videoSources', videoSources]);
			$('#videocontainer').show('slow');
			$('.preload').hide('slow');

			loadPlayer([videoObj]);
			
			console.log('Conversion performed successfully', data)
			showMessage('Conversion performed successfully', 'success');
			var scope = angular.element('body').scope();
			scope.getlist();

		}

		function errorFn(data){
			console.log(data);
			showMessage('Internal Error Server: '+data, 'error');
		}

		function showMessage(msg, type){
			$('.message').removeClass('error');
			$('.message').removeClass('success');

			$('.message').show();
			$('.message').addClass(type);
			$('.message span').text(msg);
		}
	});

	init();
})