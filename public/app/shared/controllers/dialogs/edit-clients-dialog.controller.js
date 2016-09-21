sharedModule
	.controller('editClientsDialogController', ['$scope', '$mdDialog', 'Preloader', 'Client', function($scope, $mdDialog, Preloader, Client){
		var urlBase = 'client';
		
		Client.show(Preloader.get().id)
			.success(function(data){
				$scope.client = data;
				$scope.label = data.name;
			})

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
				Client.update($scope.client.id, $scope.client)
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