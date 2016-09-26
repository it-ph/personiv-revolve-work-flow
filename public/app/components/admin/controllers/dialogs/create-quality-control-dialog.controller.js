adminModule
	.controller('createQualityControlDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', function($scope, $mdDialog, Preloader, User){
		$scope.user = {};
		$scope.user.role = 'quality_control';
		$scope.label = 'Quality Control';

		$scope.busy = false;
		$scope.duplicate = false;
		$scope.showHints = true;

		$scope.checkDuplicate = function(){
			User.checkEmail($scope.user)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			$scope.showHints = false;
			if($scope.userForm.$invalid){
				angular.forEach($scope.userForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if($scope.user.password != $scope.user.confirm)
			{
				return;
			}
			
			$scope.busy = true;
			User.store($scope.user)
				.success(function(duplicate){
					if(duplicate){
						$scope.busy = false;
						return;
					}

					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		}
	}]);