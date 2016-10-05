designerModule
	.controller('batchForQCRevisedDialogController', ['$scope', '$mdDialog', 'Preloader', 'Rework', function($scope, $mdDialog, Preloader, Rework){
		$scope.tasks = Preloader.get();
		$scope.busy = false;

		$scope.label = 'Batch For QC Revised';
		$scope.action = 'For QC Revised';

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

				Rework.forQC(query)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);