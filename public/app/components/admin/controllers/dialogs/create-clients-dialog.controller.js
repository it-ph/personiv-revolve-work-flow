adminModule
	.controller('createClientsDialogController', ['$scope', '$mdDialog', 'Preloader', 'Client', function($scope, $mdDialog, Preloader, Client){
		var urlBase = 'client';
		$scope.client = {};
		$scope.busy = false;
		$scope.duplicate = false;

		$scope.checkDuplicate = function(){
			Preloader.checkDuplicate(urlBase, $scope.client)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.clientForm.$invalid){
				angular.forEach($scope.clientForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate){
				$scope.busy = true;
				Client.store($scope.client)
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
		}
	}]);