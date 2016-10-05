sharedModule
	.controller('batchCompleteDialogController', ['$scope', '$mdDialog', 'Preloader', 'QualityControlAssigned', 'Rework', function($scope, $mdDialog, Preloader, QualityControlAssigned, Rework){
		$scope.tasks = Preloader.get();
		$scope.busy = false;

		$scope.label = 'Batch Complete';
		$scope.action = 'Complete';

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if(!$scope.busy){
				$scope.busy = true;

				var query = {};
				query.tasks = [];
				query.reworks = [];
				query.batch = true;

				angular.forEach($scope.tasks, function(item){
					if(item.include && !item.reworks.length)
					{
						query.tasks.push(item);
					}
					else if(item.include && item.reworks.length)
					{
						query.reworks.push(item);
					}
				});

				if(query.tasks.length)
				{
					QualityControlAssigned.complete(query)
						.success(function(){
							Preloader.stop();
						})
						.error(function(){
							Preloader.error();
						});
				}

				if(query.reworks.length)
				{
					Rework.complete(query)
						.success(function(){
							Preloader.stop();
						})
						.error(function(){
							Preloader.error();
						});
				}

			}
		}
	}]);