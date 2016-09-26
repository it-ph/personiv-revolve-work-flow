adminModule
	.controller('editUsersDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', function($scope, $mdDialog, Preloader, User){
		User.show(Preloader.get().id)
			.success(function(data){
				$scope.user = data;
				$scope.label = data.name;
			})
			

		$scope.busy = false;
		$scope.duplicate = false;
		$scope.showHints = true;
		$scope.roles = [
			{
				'label': 'Designer',
				'value': 'designer',
			},
			{
				'label': 'Quality Control',
				'value': 'quality_control',
			},
		];

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
			User.update($scope.user.id, $scope.user)
				.success(function(data){
					if(typeof data == 'boolean'){
						$scope.busy = false;
						return;
					}

					Preloader.stop(data);
				})
				.error(function(){
					Preloader.error();
				});
		}
	}]);