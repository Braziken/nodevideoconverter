function ListCtrl($scope, $http) {

	$scope.list = [];
	$scope.getList = function(callback){
		$http.get('/file/list').success(function(data){
			console.log(data);
			$scope.list = data;
			for(var i=0; i<data.length; i++){
				$scope.list[i].sources = { 
					"mp4" : data[i][0].url, 
					"webm" : data[i][1].url, 
					"ogg" : data[i][2].url 

				}
			}
		});
	};

	$scope.getList();
}