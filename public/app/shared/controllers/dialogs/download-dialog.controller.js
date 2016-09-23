sharedModule
	.controller('downloadDialogController', ['$scope', '$mdDialog', '$filter', function($scope, $mdDialog, $filter){
		$scope.date = {};
		$scope.date.start = new Date();
		$scope.date.end = new Date();

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.downloadForm.$invalid){
				angular.forEach($scope.downloadForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				var win = window.open('/spreadsheet-download/' + $filter('date')($scope.date.start, 'yyyy-MM-dd') + '/to/' + $filter('date')($scope.date.end, 'yyyy-MM-dd'), '_blank');
				win.focus();
			}

		}

	}]);