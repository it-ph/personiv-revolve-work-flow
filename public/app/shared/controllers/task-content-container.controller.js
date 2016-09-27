sharedModule	
	.controller('taskContentContainerController', ['$scope', '$mdDialog', '$state', '$stateParams', 'Preloader', 'Task', 'DesignerAssigned', 'Rework', 'QualityControlAssigned', 'Comment', 'User', function($scope, $mdDialog, $state, $stateParams, Preloader, Task, DesignerAssigned, Rework, QualityControlAssigned, Comment, User){
		var taskID = $stateParams.taskID;

		$scope.toolbar = {};

		$scope.toolbar.hideSearchIcon = true;

		$scope.comment = {};
		$scope.comment.task_id = taskID;

		$scope.$on('refresh', function(){
			$scope.init();
		});

		/* Designer actions */
		// check the user if he has pending works before executing this
		$scope.start = function()
		{
			var dialog = {
				'title': 'Start',
				'message': 'Start working on this task?',
				'ok': 'start',
				'cancel': 'cancel',
			};

			Preloader.confirm(dialog)
				.then(function(){
					Preloader.preload();
					DesignerAssigned.start($scope.task)
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
				'message': 'Submit task for quality control?',
				'ok': 'Continue',
				'cancel': 'Cancel',
			};

			if(!$scope.task.reworks.length)
			{
				dialog.title = 'For QC';
			}
			else {
				dialog.title = 'For QC Revised';
			}

			Preloader.confirm(dialog)
				.then(function(){
					Preloader.preload();
					if(!$scope.task.reworks.length)
					{
						DesignerAssigned.forQC($scope.task)
							.success(function(data){
								Preloader.stop();
								$scope.init();
							})
							.error(function(){
								Preloader.error();
							})
					}
					else{
						Rework.forQC($scope.task)
							.success(function(data){
								Preloader.stop();
								$scope.init();
							})
							.error(function(){
								Preloader.error();
							})
					}
				}, function(){
					return;
				})
		}

		$scope.revision = function()
		{
			var dialog = {
				'title': 'Revise',
				'message': 'Start revising this task?',
				'ok': 'Revise',
				'cancel': 'Cancel',
			};

			Preloader.confirm(dialog)
				.then(function(){
					Preloader.preload();
					Rework.revise($scope.task)
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

		$scope.pass = function()
		{
			var dialog = {
				'title': 'Pass',
				'message': 'Have other people continue this revision?',
				'ok': 'Pass',
				'cancel': 'Cancel',
			};

			Preloader.confirm(dialog)
				.then(function(){
					Preloader.preload();
					Rework.pass($scope.task)
						.success(function(data){
							Preloader.stop();
							$state.go('main.tracker');
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

		$scope.startQC = function()
		{
			var dialog = {
				'title': 'Start',
				'message': 'Start working on this task?',
				'ok': 'start',
				'cancel': 'cancel',
			};

			Preloader.confirm(dialog)
				.then(function(){
					Preloader.preload();
					if(!$scope.task.reworks.length)
					{
						QualityControlAssigned.store($scope.task)
							.success(function(data){
								Preloader.stop();
								$scope.init();
							})
							.error(function(){
								Preloader.error();
							})
					}
					else{
						Rework.startQC($scope.task)
							.success(function(data){
								Preloader.stop();
								$scope.init();
							})
							.error(function(){
								Preloader.error();
							})
					}
				}, function(){
					return;
				})
		}

		$scope.complete = function()
		{
			var dialog = {
				'title': 'Complete',
				'message': 'Mark this task as complete?',
				'ok': 'complete',
				'cancel': 'cancel',
			};

			Preloader.confirm(dialog)
				.then(function(){
					Preloader.preload();
					if(!$scope.task.reworks.length)
					{
						QualityControlAssigned.complete($scope.task)
							.success(function(data){
								Preloader.stop();
								$scope.init();
							})
							.error(function(){
								Preloader.error();
							})
					}
					else{
						Rework.complete($scope.task)
							.success(function(data){
								Preloader.stop();
								$scope.init();
							})
							.error(function(){
								Preloader.error();
							})
					}
				}, function(){
					return;
				})
		}

		$scope.rework = function()
		{
			var dialog = {
				'title': 'Rework',
				'placeholder': 'Comment',
				'message': 'Tell ' + $scope.task.designer_assigned.designer.name + ' how can he improve his work.',
				'ok': 'comment',
				'cancel': 'cancel',
			};

			Preloader.prompt(dialog)
				.then(function(message){
					if(!message){
						return;
					}

					Preloader.preload();

					var comment = {};
					comment.task_id = taskID;
					comment.message = message;
					if($scope.task.quality_control_assigned.time_end)
					{
						comment.rework = true;
					}

					Comment.store(comment)
						.success(function(){
							if(!$scope.task.quality_control_assigned.time_end)
							{
								QualityControlAssigned.rework($scope.task)
									.success(function(data){
										Preloader.stop();
										$scope.init();
									})
									.error(function(){
										Preloader.error();
									})
							}
							else{
								Rework.rework($scope.task)
									.success(function(data){
										Preloader.stop();
										$scope.init();
									})
									.error(function(){
										Preloader.error();
									})
							}

						})
						.error(function(){
							Preloader.error();
						});

				}, function(){
					return;
				})
		}


		$scope.submit = function(){
			if($scope.comment.message)
			{
				$scope.busy = true;
				if($scope.task.quality_control_assigned.time_end)
				{
					$scope.comment.rework = true;
				}
				Comment.store($scope.comment)
					.success(function(data){
						$scope.comment.message = null;
						$scope.comment.rework = false;
						$scope.init();
					})
					.error(function(){
						$scope.busy = false;
						Preloader.error();
					})
			}
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
					{
						'relation': 'reworks',
						'withTrashed': false,
						'with': [
							{
								'relation' : 'designer',
								'withTrashed': true,
							},
							{
								'relation' : 'quality_control',
								'withTrashed': true,
							},
						]
					},
					{
						'relation' : 'comments',
						'withTrashed': false,
						'with': [
							{
								'relation': 'user',
								'withTrashed': true,
							}
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

			User.pending()
				.success(function(data){
					if(!data)
					{
						$scope.hasPending = false;	
					}
					else{
						$scope.current = data;
						$scope.hasPending = data == taskID ? false: true;
					}
				})

			Task.enlist(query)
				.success(function(data){
					$scope.unauthorized = $scope.user.role == 'designer' ? true : false;
					if(data.designer_assigned)
					{
						$scope.unauthorized = false;
						
						if(data.designer_assigned.designer.id != $scope.user.id && $scope.user.role == 'designer')
						{
							$scope.unauthorized = true;
						}

						data.designer_assigned.time_start = data.designer_assigned.time_start ? new Date(data.designer_assigned.time_start) : null;
						data.designer_assigned.time_end = data.designer_assigned.time_end ? new Date(data.designer_assigned.time_end) : null;
					}
					if(data.quality_control_assigned)
					{
						if(data.quality_control_assigned.quality_control.id != $scope.user.id && $scope.user.role == 'quality_control')
						{
							$scope.unauthorized = true;
						}
						data.quality_control_assigned.time_start = data.quality_control_assigned.time_start ? new Date(data.quality_control_assigned.time_start) : null;
						data.quality_control_assigned.time_end = data.quality_control_assigned.time_end ? new Date(data.quality_control_assigned.time_end) : null;
					}

					if(data.comments.length)
					{
						angular.forEach(data.comments, function(comment){
							comment.first_letter = comment.user.name.charAt(0).toUpperCase();
							comment.created_at = new Date(comment.created_at);
						});
					}

					if(data.reworks.length)
					{
						$scope.under_qc = false;
						$scope.under_revision = false;
						angular.forEach(data.reworks, function(rework){
							rework.designer_time_start =  rework.designer_time_start ? new Date(rework.designer_time_start) : null;
							rework.designer_time_end =  rework.designer_time_end ? new Date(rework.designer_time_end) : null;
							rework.quality_control_time_start =  rework.quality_control_time_start ? new Date(rework.quality_control_time_start) : null;
							rework.quality_control_time_end =  rework.quality_control_time_end ? new Date(rework.quality_control_time_end) : null;

							$scope.under_revision = rework.designer_time_start && !rework.designer_time_end ? true : false;
							$scope.under_qc = rework.quality_control_time_start && !rework.quality_control_time_end ? true : false;							
						});

						$scope.authorized_designer_id = data.reworks[data.reworks.length-1].designer_id ? data.reworks[data.reworks.length-1].designer_id : $scope.user.id;
						$scope.authorized_quality_control_id = data.reworks[data.reworks.length-1].quality_control_id ? data.reworks[data.reworks.length-1].quality_control_id : $scope.user.id;
					}

					$scope.task = data;
					$scope.busy = false;
					$scope.task.first_letter = data.file_name.charAt(0).toUpperCase();
					$scope.task.category = data.category.name;
					$scope.task.client = data.client.name;
					$scope.toolbar.childState = data.file_name;
				})
				.error(function(){
					Preloader.error();
				})
		}

		$scope.init();
	}]);