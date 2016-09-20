sharedModule	
	.controller('taskContentContainerController', ['$scope', '$mdDialog', '$state', '$stateParams', 'Preloader', 'Task', 'DesignerAssigned', 'QualityControlAssigned', function($scope, $mdDialog, $state, $stateParams, Preloader, Task, DesignerAssigned, QualityControlAssigned){
		var taskID = $stateParams.taskID;

		$scope.toolbar = {};

		$scope.toolbar.hideSearchIcon = true;

		/* Designer actions */
		// check the user if he has pending works before executing this
		$scope.start = function()
		{
			var dialog = {
				'title': 'Start',
				'message': 'Start on working this task?',
				'ok': 'start',
				'cancel': 'cancel',
			};

			Preloader.confirm(dialog)
				.then(function(){
					DesignerAssigned.start($scope.task)
						.success(function(data){
							$scope.init();
						})
						.error(function(){
							Preloader.error();
						})
				}, function(){
					return;
				})
		}

		$scope.decline = function()
		{
			var query = {
				'title': 'Decline task',
				'message': 'This task will be removed from the list.',
				'ok': 'Decline',
				'cancel': 'Cancel',
			}

			Preloader.confirm(query)
				.then(function(){
					Preloader.preload();
					DesignerAssigned.decline($scope.task)
						.success(function(){
							Preloader.stop();
							$state.go('main.tracker');
						})
						.error(function(){
							Preloader.error();
						})
				})
		}
		
		$scope.forQC = function()
		{
			var dialog = {
				'title': 'For QC',
				'message': 'Submit task for quality control?',
				'ok': 'Continue',
				'cancel': 'Cancel',
			};

			Preloader.confirm(dialog)
				.then(function(){
					Preloader.preload();
					DesignerAssigned.forQC($scope.task)
						.success(function(data){
							Preloader.stop();
							$scope.init();
						})
						.error(function(){
							Preloader.error();
						})
				}, function(){
					return;
				})
		}

		/* Admin QC Actions */
		$scope.assign = function()
		{
			$scope.task.include = true;
			Preloader.set([$scope.task]);
			$mdDialog.show({
		      	controller: 'assignTasksDialogController',
		      	templateUrl: '/app/shared/templates/dialogs/assign-tasks-dialog.template.html',
		      	parent: angular.element(document.body),
		      	fullscreen: true,
		    })
		    .then(function(){
		    	$scope.init();
		    }, function(){
		    	return;
		    })
		}
		
		$scope.reassign = function()
		{
			$scope.task.include = true;
			Preloader.set($scope.task);
			$mdDialog.show({
		      	controller: 'reassignTasksDialogController',
		      	templateUrl: '/app/shared/templates/dialogs/reassign-tasks-dialog.template.html',
		      	parent: angular.element(document.body),
		      	fullscreen: true,
		    })
		    .then(function(){
		    	$scope.init();
		    }, function(){
		    	return;
		    })
		}

		$scope.delete = function()
		{
			var query = {
				'title': 'Delete task',
				'message': 'This task will be removed from the list.',
				'ok': 'Delete',
				'cancel': 'Cancel',
			}

			Preloader.confirm(query)
				.then(function(){
					Preloader.preload();
					Task.delete(taskID)
						.success(function(){
							Preloader.stop();
							$state.go('main.tracker');
						})
						.error(function(){
							Preloader.error();
						})
				})
		}

		$scope.init = function(){
			var query = {
				'withTrashed': true,
				'with': [
					{
						'relation' : 'category',
						'withTrashed': true,
					},
					{
						'relation' : 'client',
						'withTrashed': true,
					},
					{
						'relation': 'designer_assigned',
						'withTrashed': false,
						'with': [
							{
								'relation' : 'designer',
								'withTrashed': true,
							},
						]
					},
					{
						'relation': 'quality_control_assigned',
						'withTrashed': false,
						'with': [
							{
								'relation' : 'quality_control',
								'withTrashed': true,
							},
						]
					},
				],
				'where': [
					{
						'label':'id',
						'condition':'=',
						'value':taskID,
					},
				],
			};

			Task.enlist(query)
				.success(function(data){
					$scope.unauthorized = false;
					if(data.designer_assigned)
					{
						if(data.designer_assigned.designer.id != $scope.user.id && $scope.user.role == 'designer')
						{
							$scope.unauthorized = true;
						}

						data.designer_assigned.time_start = data.designer_assigned.time_start ? new Date(data.designer_assigned.time_start) : null;
						data.designer_assigned.time_end = data.designer_assigned.time_end ? new Date(data.designer_assigned.time_end) : null;
					}
					if(data.quality_control)
					{
						if(data.designer_assigned.designer.id != $scope.user.id && $scope.user.role == 'designer')
						{
							$scope.unauthorized = true;
						}
						data.quality_control_assigned.time_start = data.quality_control_assigned.time_start ? new Date(data.quality_control_assigned.time_start) : null;
						data.quality_control_assigned.time_end = data.quality_control_assigned.time_end ? new Date(data.quality_control_assigned.time_end) : null;
					}

					$scope.task = data;
					$scope.task.first_letter = data.file_name.charAt(0).toUpperCase();
					$scope.task.category = data.category.name;
					$scope.task.client = data.client.name;
					$scope.toolbar.childState = data.file_name;
				})
		}

		$scope.init();
	}]);