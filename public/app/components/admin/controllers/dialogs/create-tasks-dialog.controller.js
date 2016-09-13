adminModule
	.controller('createTasksDialogController', ['$scope', '$mdDialog', 'Preloader', 'Category', 'Client', 'Task', function($scope, $mdDialog, Preloader, Category, Client, Task){
		var urlBase = 'task';
		$scope.task = {};
		$scope.task.delivery_date = new Date();
		$scope.task.live_date = new Date();
		$scope.busy = false;
		$scope.duplicate = false;

		Category.index()
			.success(function(data){
				$scope.categories = data;
			})

		Client.index()
			.success(function(data){
				$scope.clients = data;
			})

		$scope.checkDuplicate = function(){
			Preloader.checkDuplicate(urlBase, $scope.task)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.taskForm.$invalid){
				angular.forEach($scope.taskForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate){
				$scope.busy = true;
				
				$scope.task.delivery_date = $scope.task.delivery_date.toDateString();
				$scope.task.live_date = $scope.task.live_date.toDateString();

				Task.store($scope.task)
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