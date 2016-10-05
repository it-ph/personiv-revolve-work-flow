sharedModule
	.controller('editTaskDialogController', ['$scope', '$mdDialog', 'Preloader', 'Category', 'Client', 'Task', function($scope, $mdDialog, Preloader, Category, Client, Task){
		var urlBase = 'task';
		var taskID = Preloader.get();
		
		$scope.busy = false;
		$scope.duplicate = false;

		Task.show(taskID)
			.success(function(data){
				data.delivery_date = new Date(data.delivery_date);
				data.live_date = new Date(data.live_date);
				$scope.task = data;
			});

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

				Task.update(taskID, $scope.task)
					.success(function(data){
						if(typeof data === 'boolean'){
							$scope.busy = false;
							return;
						}

						Preloader.stop(data);
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);