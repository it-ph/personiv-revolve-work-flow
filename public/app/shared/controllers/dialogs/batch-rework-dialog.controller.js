sharedModule
	.controller('batchReworkDialogController', ['$scope', '$mdDialog', 'Preloader', 'Comment', 'QualityControlAssigned', 'Rework', function($scope, $mdDialog, Preloader, Comment, QualityControlAssigned, Rework){
		$scope.tasks = Preloader.get();
		$scope.comment = {};
		$scope.busy = false;

		$scope.label = 'Batch Rework';
		$scope.action = 'Rework';

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
				query.first_rework = [];
				query.rework_again = [];
				query.batch = true;

				angular.forEach($scope.tasks, function(item){
					if(item.include)
					{
						item.message = $scope.comment.message;
						if(item.quality_control_assigned.time_end)
						{
							item.rework = true;
							query.rework_again.push(item);
						}
						else{
							query.first_rework.push(item);
						}

						query.tasks.push(item);
					}
				});

				Comment.store(query)
					.success(function(){

						if(query.first_rework.length)
						{
							QualityControlAssigned.rework(query)
								.success(function(){
									Preloader.stop();
								})
								.error(function(){
									Preloader.error();
								});
						}
						
						if(query.rework_again.length)
						{
							Rework.rework(query)
								.success(function(){
									Preloader.stop();
								})
								.error(function(){
									Preloader.error();
								});
						}
					});


			}
		}
	}]);