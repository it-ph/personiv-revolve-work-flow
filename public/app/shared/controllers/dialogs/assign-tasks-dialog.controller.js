sharedModule
	.controller('assignTasksDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', 'DesignerAssigned', function($scope, $mdDialog, Preloader, User, DesignerAssigned){
		$scope.tasks = Preloader.get();
		$scope.busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.setDesigner = function(){
			angular.forEach($scope.tasks, function(task, key){
				if(task.include){
					task.designer_id = $scope.designer;
				}
			});
		}

		var query = {
			'where': [
				{
					'label': 'role',
					'condition': '=',
					'value': 'designer',
				}
			],
		}

		User.enlist(query)
			.success(function(data){
				$scope.users = data;
			})

		$scope.submit = function(){
			if($scope.assignTaskForm.$invalid){
				angular.forEach($scope.assignTaskForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.busy){
				$scope.busy = true;
				DesignerAssigned.store($scope.tasks)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);