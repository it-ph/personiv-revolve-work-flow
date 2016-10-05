sharedModule
	.controller('batchReworkTasksDialogController', ['$scope', '$mdDialog', 'Preloader', 'QualityControlAssigned', 'Comment', function($scope, $mdDialog, Preloader, QualityControlAssigned, Comment){
		$scope.tasks = Preloader.get();
		$scope.comment = {};
		$scope.busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}
		$scope.submit = function(){
			if($scope.reworkTaskForm.$invalid){
				angular.forEach($scope.reworkTaskForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.busy){
				$scope.busy = true;

				var query = {};
				query.tasks = [];
				query.batch = true;

				angular.forEach($scope.tasks, function(task){
					if(task.include)
					{
						query.tasks.push(task);
					}
				});

				Comment.store(query)
					.success(function(){
						
					})

				QualityControlAssigned.rework(query)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);