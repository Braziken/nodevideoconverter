$(document).ready(function(){

	var init = function (){
		$('.progress').hide();

		$('.preload').addClass('hide');
		$('.message').addClass('hide');
		$('#videocontainer').hide();
		$('.message span').text('');
	}

	var loadPlayer = function (videoFiles){
		$("#videoplayer").flowplayer({
			playlist: [videoFiles]
		});
	}
	init();

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
			console.log('Conversion performed successfully', data)
			var videoSources = [];
			var videoObj = {};
			for(var i=0; i<data.outputs.length; i++){
				//videoSources +=  '<source src="'+data.outputs[i].url+'" type="video/'+data.outputs[i].label+'" />' ;
				videoObj[data.outputs[i].label] = data.outputs[i].url;
				videoSources.push(videoObj);
			}

			console.log(['videoSources', videoSources]);
			$('#videocontainer').show('slow');
			$('.preload').hide('slow');

				/*$('#videoplayer').html('<video controls="true"></video>')
				$('#videoplayer video').html(videoSources);
				$('#videoplayer video').load();*/
				console.log(videoObj)
				loadPlayer([videoObj]);
				showMessage('Conversion performed successfully', 'success');


			}

			function errorFn(data){
				console.log(data);
				showMessage('Internal Error Server: '+data, 'error');
			}

			function showMessage(msg, type){
				$('.message').removeClass('error');
				$('.message').removeClass('success');

				$('.message').addClass(type);
				$('.message span').text(msg);
			}
		});
})