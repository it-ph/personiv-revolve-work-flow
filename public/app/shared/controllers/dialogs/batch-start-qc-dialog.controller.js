sharedModule
	.controller('batchStartQCDialogController', ['$scope', '$mdDialog', 'Preloader', 'QualityControlAssigned', function($scope, $mdDialog, Preloader, QualityControlAssigned){
		$scope.tasks = Preloader.get();
		$scope.busy = false;

		$scope.label = 'Batch For QC';
		$scope.action = 'For QC';

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

				QualityControlAssigned.store(query)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);