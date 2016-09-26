sharedModule
	.controller('editCategoriesDialogController', ['$scope', '$mdDialog', 'Preloader', 'Category', function($scope, $mdDialog, Preloader, Category){
		var urlBase = 'category';
		
		Category.show(Preloader.get().id)
			.success(function(data){
				$scope.category = data;
				$scope.label = data.name;
			})

		$scope.busy = false;
		$scope.duplicate = false;

		$scope.checkDuplicate = function(){
			Preloader.checkDuplicate(urlBase, $scope.category)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.categoryForm.$invalid){
				angular.forEach($scope.categoryForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate){
				$scope.busy = true;
				Category.update($scope.category.id, $scope.category)
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