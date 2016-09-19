sharedModule	
	.controller('taskContentContainerController', ['$scope', '$state', '$stateParams', 'Preloader', 'Task', 'DesignerAssigned', function($scope, $state, $stateParams, Preloader, Task, DesignerAssigned){
		var taskID = $stateParams.taskID;

		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Task';
		$scope.toolbar.back = function(){
			$state.go('main.tracker');
		};

		$scope.toolbar.showBack = true;

		$scope.toolbar.hideSearchIcon = true;

		// check the user if he has pending works

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
					Task.started($scope.task)
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

		$scope.init = function(){
			var query = {
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
					if(data.designer_assigned)
					{
						data.designer_assigned.time_start = data.designer_assigned.time_start ? new Date(data.designer_assigned.time_start) : null;
						data.designer_assigned.time_end = data.designer_assigned.time_end ? new Date(data.designer_assigned.time_end) : null;
					}
					if(data.quality_control)
					{
						data.quality_control_assigned.time_start = data.quality_control_assigned.time_start ? new Date(data.quality_control_assigned.time_start) : null;
						data.quality_control_assigned.time_end = data.quality_control_assigned.time_end ? new Date(data.quality_control_assigned.time_end) : null;
					}

					$scope.task = data;
					$scope.toolbar.childState = data.file_name;
				})
		}

		$scope.init();
	}]);