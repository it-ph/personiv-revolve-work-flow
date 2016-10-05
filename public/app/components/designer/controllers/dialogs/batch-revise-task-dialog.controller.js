designerModule
	.controller('batchReviseTaskDialogController', ['$scope', '$mdDialog', 'Preloader', 'Rework', function($scope, $mdDialog, Preloader, Rework){
		$scope.tasks = Preloader.get();
		$scope.busy = false;

		$scope.label = 'Batch Start Revision';
		$scope.action = 'Start Revision';

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if(!$scope.busy){
				$scope.busy = true;

				var query = {};
				query.tasks = [];
				query.batch = true;

				angular.forEach($scope.tasks, function(item){
					if(item.include)
					{
						query.tasks.push(item);
					}
				});

				Rework.revise(query)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);