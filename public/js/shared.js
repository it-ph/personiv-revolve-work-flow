var sharedModule = angular.module('sharedModule', [
	'ui.router',
	'ngMaterial',
	'ngMessages',
	'infinite-scroll',
	'chart.js',
	'angularMoment',
	'angularFileUpload'
]);
sharedModule
	.config(['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', function($urlRouterProvider, $stateProvider, $mdThemingProvider){
		/* Defaul Theme Blue - Light Blue */
		$mdThemingProvider.theme('default')
			.primaryPalette('light-blue')
			.accentPalette('pink')
		
		/* Dark Theme - Blue */
		$mdThemingProvider.theme('dark', 'default')
	      	.primaryPalette('blue')
			.dark();

		$urlRouterProvider
			.otherwise('/page-not-found')
			.when('', '/');

		$stateProvider
			.state('page-not-found',{
				url: '/page-not-found',
				templateUrl: '/app/shared/views/page-not-found.view.html',
			})
	}]);
sharedModule
	.controller('changePasswordDialogController', ['$scope', '$mdDialog', 'User', 'Preloader', function($scope, $mdDialog, User, Preloader){
		$scope.password = {};

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.checkPassword = function(){
			User.checkPassword($scope.password)
				.success(function(data){
					$scope.match = data;
					$scope.show = true;
				});
		}

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.changePasswordForm.$invalid){
				angular.forEach($scope.changePasswordForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else if($scope.password.old == $scope.password.new || $scope.password.new != $scope.password.confirm)
			{
				return;
			}
			else {
				$scope.busy = true;
				User.changePassword($scope.password)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('homePageController', ['$scope', function($scope){
		$scope.show = function(){
			angular.element(document.querySelector('.main-view')).removeClass('no-opacity');
		};
	}]);
sharedModule
	.controller('sharedDashboardContentContainerController', ['$scope', 'Preloader', 'User', function($scope, Preloader, User){
		$scope.toolbar = {};

		$scope.toolbar.childState = 'Dashboard';
	}]);
sharedModule
	.controller('sharedMainViewController', ['$scope', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'User', 'Preloader', 'Notification', function($scope, $state, $mdDialog, $mdSidenav, $mdToast, User, Preloader, Notification){
		$scope.toggleSidenav = function(menuID){
			$mdSidenav(menuID).toggle();
		}

		$scope.menu = {};

		$scope.menu.static = [
			{
				'state': 'main',
				'icon': 'mdi-view-dashboard',
				'label': 'Dashboard',
			},
			{
				'state': 'main.sheets',
				'icon': 'mdi-file-excel',
				'label': 'Sheets',
			},
			{
				'state': 'main.tracker',
				'icon': 'mdi-view-list',
				'label': 'Tracker',
			},
			{
				'state': 'main.notifications',
				'icon': 'mdi-bell',
				'label': 'Notifications',
			},
			{
				'state': 'main.settings',
				'icon': 'mdi-settings',
				'label': 'Settings',
			},
		]
		

		$scope.logout = function(){
			User.logout()
				.success(function(){
					window.location.href = '/';
				});
		}

		$scope.changePassword = function()
		{
			$mdDialog.show({
		      controller: 'changePasswordDialogController',
		      templateUrl: '/app/shared/templates/dialogs/change-password-dialog.template.html',
		      parent: angular.element(document.body),
		      fullscreen: true,
		    })
		    .then(function(){
		    	$mdToast.show(
		    		$mdToast.simple()
				        .content('Password changed.')
				        .position('bottom right')
				        .hideDelay(3000)
		    	);
		    });
		}

		var fetchUnreadNotifications = function(){
			User.check()
				.success(function(data){
					formatNotification(data);
					$scope.user = data;
				})
		}

		var formatNotification = function(data){
			angular.forEach(data.unread_notifications, function(notif){
				notif.first_letter = notif.data.sender.name.charAt(0).toUpperCase();
				notif.sender = notif.data.sender.name;
				notif.created_at = new Date(notif.created_at);

				if(notif.type == 'App\\Notifications\\TaskCreated'){
					notif.message = 'created a new task.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.task_id});
							})
					}
				}
				else if(notif.type == 'App\\Notifications\\SpreadsheetCreated'){
					notif.message = 'created a new sheet.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.sheet', {'sheetID': notif.data.attachment.id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\TaskAssignedToDesigner'){
					notif.message = 'assigned a task for ' + notif.data.attachment.designer.name + '.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.task_id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\DesignerTaskStart'){
					notif.message = 'started to work on ' + notif.data.attachment.task.file_name + '.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.task_id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\TaskDeleted'){
					notif.message = 'deleted a task.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\DesignerTaskDecline'){
					notif.message = 'declined to work on ' + notif.data.attachment.task.file_name + '.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.task_id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\ForQC'){
					notif.message = 'submitted a task for quality control.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\QualityControlTaskStart'){
					notif.message = 'started to work on ' + notif.data.attachment.task.file_name + '.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.task_id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\MarkAsComplete'){
					notif.message = 'marked ' + notif.data.attachment.task.file_name + ' as complete.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.task_id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\TaskRework'){
					notif.message = 'marked ' + notif.data.attachment.task.file_name + ' as rework.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.task_id});
							})
					}
				}

				else if(notif.type == 'App\\Notifications\\NotifyComment'){
					notif.message = 'commented on a task on ' + notif.data.attachment.file_name + '.';
					notif.action = function(id){
						// mark as read
						Notification.markAsRead(id)
							.success(function(data){
								formatNotification(data);
								$scope.user = data;
								$state.go('main.task', {'taskID': notif.data.attachment.id});
							})
					}
				}
			});

			return data;
		}

		$scope.markAsRead = function(id){
			Notification.markAsRead(id)
				.success(function(data){
					formatNotification(data);
					$scope.user = data;
				})
		}

		$scope.markAllAsRead = function(){
			Notification.markAllAsRead()
				.success(function(data){
					formatNotification(data);
					$scope.user = data;
				})
		}

		User.check()
			.success(function(data){
				formatNotification(data);

				$scope.user = data;

				var pusher = new Pusher('58891c6a307bb58de62e', {
			      encrypted: true
			    });

				var channel = {};

				channel.admin = pusher.subscribe('admin');
				channel.user = pusher.subscribe('user.' + $scope.user.id);					
				
			    channel.user.bindings = [
				    channel.user.bind('App\\Events\\PusherTaskCreated', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' created a new task.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherSpreadsheetCreated', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' created a new sheet.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherTaskAssignedToDesigner', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' assigned a task for ' + data.data.name + '.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherDesignerTaskStart', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' started to work on ' + data.data.file_name + '.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherTaskDeleted', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' deleted a task.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherDesignerTaskDecline', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' declined to work on ' + data.data.file_name + '.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				     channel.user.bind('App\\Events\\PusherForQC', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' submitted a task for quality control.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherQualityControlTaskStart', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' started to work on ' + data.data.file_name + '.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherMarkAsComplete', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' marked ' + data.data.file_name + ' as complete.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherTaskRework', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' marked ' + data.data.file_name + ' as rework.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherNotifyComment', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' commented on a task on ' + data.data.file_name + '.';
				    	Preloader.newNotification(message);
				    	$scope.$broadcast('refresh');
				    }),
			    ];
			})
	}]);
sharedModule
	.controller('sheetsContentContainerController', ['$scope', '$filter', '$state', 'Preloader', 'Spreadsheet', function($scope, $filter, $state, Preloader, Spreadsheet){
		$scope.toolbar = {};

		$scope.toolbar.childState = 'Sheets';

		$scope.toolbar.getItems = function(query){
			$scope.showInactive = true;
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.sheet.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.sheet.busy = false;
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			$scope.showInactive = false;
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.sheet.page = 1;
				$scope.sheet.no_matches = false;
				$scope.sheet.items = [];
				$scope.searched = false;

				$scope.init();
			}
		};

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-upload';
		$scope.fab.label = 'Upload';
		$scope.fab.action = function(){
			$state.go('main.upload');
		};

		$scope.fab.show = true;

		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};

		$scope.subheader.show = true;

		$scope.subheader.sort = [
			{
				'label': 'Tasks Number',
				'type': 'first_letter',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.subheader.refresh = function(){
			$scope.isLoading = true;
  			$scope.sheet.show = false;

  			$scope.init();
		}

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}

		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		var pushItem = function(item){
			item.updated_at = new Date(item.updated_at);
			item.first_letter = item.tasks.length
		}

		$scope.init = function(request)
		{
			$scope.sheet = {};
			$scope.sheet.items = [];

			if($scope.searched)
			{
				$scope.searchBar = false;
				$scope.toolbar.searchText = '';
				$scope.toolbar.searchItem = '';
				$scope.sheet.page = 1;
				$scope.sheet.no_matches = false;
				$scope.searched = false;
			}

			// 2 is default so the next page to be loaded will be page 2 
			$scope.sheet.page = 2;

			Spreadsheet.paginate(request)
				.success(function(data){
					$scope.sheet.details = data;
					$scope.sheet.items = data.data;
					$scope.sheet.show = true;

					/* Fab */
					$scope.fab.show = true;

					// Hides inactive records
					$scope.showInactive = false;

					if(data.data.length){
						// iterate over each record and set the updated_at date and first letter
						angular.forEach(data.data, function(item){
							pushItem(item);
						});

					}

					$scope.sheet.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.sheet.busy || ($scope.sheet.page > $scope.sheet.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.sheet.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Setting.paginate(request, $scope.sheet.page)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.sheet.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.sheet.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.sheet.busy = false;
								$scope.isLoading = false;
							});
					}
				})
		}

		$scope.init();
	}]);
sharedModule	
	.controller('taskContentContainerController', ['$scope', '$mdDialog', '$state', '$stateParams', 'Preloader', 'Task', 'DesignerAssigned', 'DesignerRework', 'QualityControlAssigned', 'QualityControlRework', 'Comment', function($scope, $mdDialog, $state, $stateParams, Preloader, Task, DesignerAssigned, DesignerRework, QualityControlAssigned, QualityControlRework, Comment){
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
					DesignerRework.revise($scope.task)
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
					QualityControlAssigned.store($scope.task)
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
					QualityControlAssigned.complete($scope.task)
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
				Comment.store($scope.comment)
					.success(function(data){
						$scope.comment.message = null;
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

					$scope.task = data;
					$scope.busy = false;
					$scope.task.first_letter = data.file_name.charAt(0).toUpperCase();
					$scope.task.category = data.category.name;
					$scope.task.client = data.client.name;
					$scope.toolbar.childState = data.file_name;
				})
		}

		$scope.init();
	}]);
sharedModule
	.controller('trackerContentContainerController', ['$scope', '$state', '$filter', '$timeout', '$mdDialog', '$mdToast', '$mdBottomSheet', '$mdMedia', 'Preloader', 'Category', 'Client', 'Task', 'User', function($scope, $state, $filter, $timeout, $mdDialog, $mdToast, $mdBottomSheet, $mdMedia, Preloader, Category, Client, Task, User){
		$scope.toolbar = {};

		$scope.toolbar.childState = 'Tracker';

		$scope.toolbar.getItems = function(query){
			$scope.showInactive = true;
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}
		$scope.toolbar.searchAll = true;

		$scope.$on('refresh', function(){
			$scope.init($scope.subheader.current.request);
		});
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.task.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.task.busy = false;
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			$scope.showInactive = false;
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.task.page = 1;
				$scope.task.no_matches = false;
				$scope.task.items = [];
				$scope.searched = false;

				$scope.init($scope.subheader.current.request);
			}
		};
		
		$scope.searchUserInput = function(){
			$scope.isLoading = true;
  			$scope.task.show = false;
  			$scope.searched = true;
  			$scope.init($scope.subheader.current.request, true);
		};

		var createTask = function(){
			$mdDialog.show({
		      	controller: 'createTasksDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/create-task-dialog.template.html',
		      	parent: angular.element(document.body),
		      	fullscreen: true,
		    })
		     .then(function(data) {
		     	pushItem(data);
		    	$scope.task.busy = true;
			    /* Refreshes the list*/
      			var message = 'A new task has been created.';
			    Preloader.notify(message)
			    	.then(function(){
				     	$scope.task.busy = false;
			    	})
		    }, function() {
		    	return;
		    });
		}

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Task';
		$scope.fab.action = createTask;

		/* Sets up the page for what tab it is*/
		var setInit = function(nav){
			$scope.subheader.current = nav;

			$scope.toolbar.items = [];
			
			$scope.init($scope.subheader.current.request);
		}

		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};

		$scope.subheader.show = true;

		$scope.subheader.navs = [
			{
				'label':'Pending',
				'request': {
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
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'pending',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Assign multiple',
						'icon': 'mdi-tag-multiple',
						action: function(){
							$scope.selectMultiple = true;
							$scope.fab.label = 'Assign';
							$scope.fab.icon = this.icon;
							$scope.fab.action = function(){
								Preloader.set($scope.task.items);
								$mdDialog.show({
							      	controller: 'assignTasksDialogController',
							      	templateUrl: '/app/shared/templates/dialogs/assign-tasks-dialog.template.html',
							      	parent: angular.element(document.body),
							      	fullscreen: true,
							    })
							    .then(function(){
							    	$scope.selectMultiple = false;
							    	$scope.fab.label = 'Task';
									$scope.fab.icon = 'mdi-plus';
									$scope.fab.action = createTask;

									$scope.subheader.refresh();
							    })
							}
						},
					},
				],
			},
			{
				'label':'In Progress',
				'request': {
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
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'in_progress',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
			},
			{
				'label':'For QC',
				'request': {
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
							'relation': 'quality_control_assigned',
							'withTrashed': false,
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'for_qc',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
			},
			{
				'label':'Rework',
				'request': {
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
						},
						{
							'relation': 'quality_control_assigned',
							'withTrashed': false,
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'rework',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
			},
			{
				'label':'Complete',
				'request': {
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
						},
						{
							'relation': 'quality_control_assigned',
							'withTrashed': false,
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'complete',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
			},
		];

		$scope.subheader.sort = [
			{
				'label': 'File Name',
				'type': 'file_name',
				'sortReverse': false,
			},
			{
				'label': 'Category',
				'type': 'category',
				'sortReverse': false,
			},
			{
				'label': 'Delivery Date',
				'type': 'delivery_date',
				'sortReverse': false,
			},
			{
				'label': 'Live Date',
				'type': 'live_date',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.subheader.cancelSelectMultiple = function(){
			$scope.selectMultiple = false;
			$scope.fab.label = 'Task';
			$scope.fab.icon = 'mdi-plus';
			$scope.fab.action = createTask;

			angular.forEach($scope.task.items, function(item){
				item.include = false;
			});
		}

		$scope.subheader.refresh = function(){
			$scope.isLoading = true;
  			$scope.task.show = false;

  			$scope.init($scope.subheader.current.request);
		}

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}

		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		$scope.subheader.setCategoryFilter = function(filter){
			if($scope.categoryFilter == filter)
			{
				return $scope.categoryFilter = '';
			}

			$scope.categoryFilter = filter;
		}

		$scope.subheader.setClientFilter = function(filter){
			if($scope.clientFilter == filter)
			{
				return $scope.clientFilter = '';
			}

			$scope.clientFilter = filter;
		}

		/**
		 * Object for rightSidenav
		 *
		*/
		$scope.rightSidenav = {};

		$scope.rightSidenav.show = false;

		var pushItem = function(item){
			item.first_letter = item.file_name.charAt(0).toUpperCase();
			item.created_at = new Date(item.created_at);
			item.updated_at = new Date(item.updated_at);
			item.delivery_date = new Date(item.delivery_date);
			item.live_date = new Date(item.live_date);
			item.deleted_at = item.deleted_at ? new Date(item.deleted_at) : null;
			item.category = item.category.name;
			item.client = item.client.name;

			var filter = {};
			filter.display = item.file_name;

			$scope.toolbar.items.push(filter);
		}

		$scope.init = function(request, searched){
			Category.index()
				.success(function(data){
					$scope.categories = data;
				})

			Client.index()
				.success(function(data){
					$scope.clients = data;
				})

			$scope.task = {};
			$scope.task.items = [];
			$scope.toolbar.items = [];

			if(searched)
			{
	  			request.searchText = $scope.toolbar.searchText;
			}
			else{
				$scope.searchBar = false;
				$scope.toolbar.searchText = '';
				$scope.toolbar.searchItem = '';
				$scope.task.page = 1;
				$scope.task.no_matches = false;
				$scope.searched = false;
				request.searchText = null;
			}

			// 2 is default so the next page to be loaded will be page 2 
			$scope.task.page = 2;

			Task.paginate(request)
				.success(function(data){
					if(!data)
					{
						$scope.task.show = true;
						return;
					}
					
					$scope.task.details = data;
					$scope.task.items = data.data;
					$scope.task.show = true;

					/* Fab */
					$scope.fab.show = true;

					// Hides inactive records
					$scope.showInactive = false;

					if(data.data.length){
						// iterate over each record and set the updated_at date and first letter
						angular.forEach(data.data, function(item){
							pushItem(item);
						});

					}

					$scope.task.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.task.busy || ($scope.task.page > $scope.task.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.task.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Task.paginate(request, $scope.task.page)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.task.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.task.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.task.busy = false;
								$scope.isLoading = false;
							});
					}
				})
		};

		$scope.subheader.currentNavItem = $scope.subheader.navs[0].label;
		
		/* Sets up the page for what tab it is*/
		setInit($scope.subheader.navs[0]);

	}]);
sharedModule
	.controller('uploadContentContainerController', ['$scope', '$filter', '$mdDialog', '$state', 'FileUploader', 'Preloader', 'Spreadsheet', 'Task', function($scope, $filter, $mdDialog, $state, FileUploader, Preloader, Spreadsheet, Task){
		$scope.toolbar = {};
		$scope.form = {};

		$scope.toolbar.items = [];
		$scope.toolbar.childState = 'Upload Sheet';

		$scope.toolbar.back = function(){
			$state.go('main.sheets');
		}

		$scope.toolbar.showBack = true;

		$scope.toolbar.getItems = function(query){
			$scope.showInactive = true;
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			$scope.searchBar = false;
		};

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Upload';

		var uploader = {};

		uploader.filter = {
            name: 'excelFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|'.indexOf(type) !== -1;
            }
        };

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.excelUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		/* Question Uploader */
		$scope.excelUploader = new FileUploader({
			url: '/spreadsheet',
			headers: uploader.headers,
			queueLimit : 1
		})
		// FILTERS
        $scope.excelUploader.filters.push(uploader.filter);
        
		$scope.excelUploader.onWhenAddingFileFailed = uploader.error;
		$scope.excelUploader.onAfterAddingFile  = function(){
			$scope.fileError = false;
			if($scope.excelUploader.queue.length)
			{	
				$scope.excelUploader.uploadAll()
			}
		};

		$scope.checkDuplicate = function(data){
			var nextLoop = true;
			var idx = $scope.tasks.indexOf(data);
			var duplicate = false;
			// checks for duplicate file name within the form.
			angular.forEach($scope.tasks, function(task, key){
				if(nextLoop && key != idx){
					console.log(data.file_name == task.file_name);
					if(data.file_name == task.file_name){
						duplicate = true;
						nextLoop = false;
					}
				}
			});

			if(duplicate){
				return data.duplicate = true;
			}
			else{
				data.duplicate = false;
			}

			Preloader.checkDuplicate('task', data)
				.success(function(bool){
					data.duplicate = bool;
				});
		}

		$scope.remove = function(data){
			var confirm = $mdDialog.confirm()
		        .title('Remove')
		        .textContent('Remove ' + data.file_name + ' from the list?')
		        .ariaLabel('Remove')
		        .ok('Remove')
		        .cancel('Cancel');

		    $mdDialog.show(confirm).then(function() {
		      	var idx = $scope.tasks.indexOf(data);
				$scope.tasks.splice(idx, 1);
		    }, function() {
		      	return;
		    });

		}

		var pushItem = function(data){
			angular.forEach(data, function(item, idx){
				var nextLoop = true;
				// compare current item with other items on the array
				angular.forEach(data, function(other, key){
					if(nextLoop && idx != key)
					{
						if(item.file_name == other.file_name){
							item.duplicate = true;
							nextLoop = false;
						}
					}
				})

				item.delivery_date = new Date(item.delivery_date);
				item.live_date = new Date(item.live_date);
				$scope.tasks.push(item);

				var filter = {};

				filter.display = item.file_name;

				$scope.toolbar.items.push(filter);
			});
		}

		$scope.excelUploader.onCompleteItem  = function(data, response){			
			Spreadsheet.read(response.id)
				.success(function(data){
					$scope.tasks = [];

					if(Array.isArray(data[0]))
					{
						angular.forEach(data, function(sheet){
							angular.forEach(sheet, function(item){
								item.spreadsheet_id = response.id;
								$scope.tasks.push(item);
							})
						});
					}
					else {
						angular.forEach(data, function(item){
							item.spreadsheet_id = response.id;
							$scope.tasks.push(item);
						})
					}
					
					Task.checkDuplicateMultiple($scope.tasks)
						.success(function(data){
							pushItem(data);
							$scope.tasks = data;
							$scope.show = true;
						})
						.error(function(){
							Preloader.error();
						})

					$scope.fab.show = true;
				})
				.error(function(){
					Preloader.error();
				})
		}

		var busy = false;
		var duplicate = false;	

		$scope.fab.action = function(){
			if($scope.form.taskForm.$invalid){
				angular.forEach($scope.form.taskForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			angular.forEach($scope.tasks, function(item){
				if(item.duplicate){
					Preloader.alert('Duplicate File Name', item.file_name +' already exists.');
					duplicate = true;
				}
				else{
					item.delivery_date = item.delivery_date.toDateString();
					item.live_date = item.live_date.toDateString();
				}
			});

			if(!busy && !duplicate){
				busy = true;
				Preloader.preload();

				Task.storeMultiple($scope.tasks)
					.success(function(data){
						busy = false;
						
						if(data){
							angular.forEach($scope.tasks, function(item){
								item.delivery_date = new Date(item.delivery_date);
								item.live_date = new Date(item.live_date);
							});

							return;
						}

						Preloader.stop();
						$scope.toolbar.back();
					})
					.error(function(){
						Preloader.error()
					});
			}
		};
	}]);
sharedModule
	.factory('Category', ['$http', function($http){
		var urlBase = '/category';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			checkDuplicate: function(data){
				return $http.post(urlBase + '/check-duplicate', data);
			},
		}
	}]);
sharedModule
	.factory('Client', ['$http', function($http){
		var urlBase = '/client';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('Comment', ['$http', function($http){
		var urlBase = '/comment';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('DesignerAssigned', ['$http', function($http){
		var urlBase = '/designer-assigned';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			paginate: function(data, page)
			{
				return $http.post(urlBase + '/paginate?page=' + page, data);
			},
			start: function(data){
				return $http.post(urlBase + '/start', data);
			},
			decline: function(data){
				return $http.post(urlBase + '/decline', data);
			},
			forQC: function(data){
				return $http.post(urlBase + '/for-qc', data);
			},
		}
	}]);
sharedModule
	.factory('DesignerRework', ['$http', function($http){
		var urlBase = '/designer-rework';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			start: function(data){
				return $http.post(urlBase + '/revise', data);
			},
		}
	}]);
sharedModule
	.factory('Notification', ['$http', function($http){
		var urlBase = '/notification';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			markAsRead: function(id){
				return $http.post(urlBase + '/mark-as-read/' + id);
			},
			markAllAsRead: function(){
				return $http.post(urlBase + '/mark-all-as-read');
			},
		}
	}]);
sharedModule
	.factory('QualityControlAssigned', ['$http', function($http){
		var urlBase = '/quality-control-assigned';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			complete: function(data){
				return $http.post(urlBase + '/complete', data);
			},
			rework: function(data){
				return $http.post(urlBase + '/rework', data);
			},
		}
	}]);
sharedModule
	.factory('QualityControlRework', ['$http', function($http){
		var urlBase = '/quality-control-rework';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('QualityControlTask', ['$http', function($http){
		var urlBase = '/quality-control-task';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('Rework', ['$http', function($http){
		var urlBase = '/rework';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('Spreadsheet', ['$http', function($http){
		var urlBase = '/spreadsheet';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			read: function(id){
				return $http.get(urlBase + '/read/' + id);
			},
			paginate: function(request, page){
				return $http.post(urlBase + '/paginate?page=' + page, request);
			},
		}
	}]);
sharedModule
	.factory('Task', ['$http', function($http){
		var urlBase = '/task';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			paginate: function(data, page){
				if(!page)
				{
					return $http.post(urlBase + '/paginate', data);
				}
				
				return $http.post(urlBase + '/paginate?page=' + page, data);
			},
			storeMultiple: function(data){
				return $http.post(urlBase + '/store-multiple', data);
			},
			checkDuplicateMultiple: function(data){
				return $http.post(urlBase + '/check-duplicate-multiple', data);
			},
			enlist: function(data){
				return $http.post(urlBase + '/enlist', data);
			},
		}
	}]);
sharedModule
	.factory('User', ['$http', function($http){
		var urlBase = '/user';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},

			/* checks authenticated user */
			check: function(query){
				return $http.post(urlBase + '/check', query);
			},
			/* logout authenticated user */
			logout: function(){
				return $http.post(urlBase + '/logout');
			},
			/* checks if email is in use */
			checkEmail: function(data){
				return $http.post(urlBase + '/check-email', data);
			},
			/* checks old password is the same with new password */
			checkPassword: function(data){
				return $http.post(urlBase + '/check-password', data);
			},
			/* changes password of authenticated user */
			changePassword: function(data){
				return $http.post(urlBase + '/change-password', data);
			},
			/* resets passwords of specific user */
			resetPassword: function(data){
				return $http.post(urlBase + '/reset-password', data);
			},
			paginate: function(page){
				return $http.get(urlBase + '/paginate?page=' + page);
			},
			disable: function(data){
				return $http.post(urlBase + '/disable', data);
			},
			markAsRead: function(id){
				return $http.get(urlBase + '/mark-as-read/' + id);
			},
			enlist: function(data){
				return $http.post(urlBase + '/enlist', data);
			},
		}
	}]);
sharedModule
	.service('Preloader', ['$mdDialog', '$mdToast', '$http', function($mdDialog, $mdToast, $http){
		var dataHolder = null;

		return {
			prompt: function(data)
			{
				var prompt = $mdDialog.prompt()
			    	.title(data.title)
			      	.textContent(data.message)
			      	.placeholder(data.placeholder)
			      	.ariaLabel(data.title)
			      	.ok(data.ok)
			      	.cancel(data.cancel);

			    return $mdDialog.show(prompt);
			},
			confirm: function(data)
			{
				var confirm = $mdDialog.confirm()
			        .title(data.title)
			        .textContent(data.message)
			        .ariaLabel(data.title)
			        .ok(data.ok)
			        .cancel(data.cancel);

			    return $mdDialog.show(confirm);
			},
			alert: function(title, message){
				$mdDialog.show(
					$mdDialog.alert()
				        .parent(angular.element($('body')))
				        .clickOutsideToClose(true)
				        .title(title)
				        .textContent(message)
				        .ariaLabel(title)
				        .ok('Got it!')
				    );
			},
			newNotification: function(message, action) {
				var toast = $mdToast.simple()
			      	.textContent(message)
			      	.action(action)
			      	.highlightAction(true)
			      	.highlightClass('md-primary')// Accent is used by default, this just demonstrates the usage.
			      	.position('bottom right');

			    var audio = new Audio('/audio/notif.mp3')
			    audio.play();
			    
			    return $mdToast.show(toast);
			},
			/* Notifies a user with a message */
			notify: function(message){
				return $mdToast.show(
			    	$mdToast.simple()
				        .textContent(message)
				        .position('bottom right')
				        .hideDelay(3000)
			    );
			},
			/* Starts the preloader */
			preload: function(){
				return $mdDialog.show({
					templateUrl: '/app/shared/views/loading.html',
				    parent: angular.element(document.body),
				});
			},
			/* Stops the preloader */
			stop: function(data){
				return $mdDialog.hide(data);
			},
			/* Shows error message if AJAX failed */
			error: function(){
				return $mdDialog.show(
			    	$mdDialog.alert()
				        .parent(angular.element($('body')))
				        .clickOutsideToClose(true)
				        .title('Oops! Something went wrong!')
				        .content('An error occured. Please contact administrator for assistance.')
				        .ariaLabel('Error Message')
				        .ok('Got it!')
				);
			},
			/* Send temporary data for retrival */
			set: function(data){
				dataHolder = data;
			},
			/* Retrieves data */
			get: function(){
				return dataHolder;
			},
			checkDuplicate: function(urlBase, data){
				return $http.post(urlBase + '/check-duplicate', data);
			},
		};
	}]);
sharedModule
	.service('Setting', ['$http', '$mdToast', function($http, $mdToast){
		return {
			paginate: function(type, page){
				var urlBase = type == 'Categories' ? 'category' : (type == 'Clients' ? 'client' : (type == 'Designers' ? 'user/designers' : 'user/quality_control'));

				return $http.post(urlBase + '/paginate?page=' + page);
			},
			search: function(type, data){
				var urlBase = type == 'Categories' ? 'category/enlist' : (type == 'Clients' ? 'client/enlist' : 'user/enlist');

				return $http.post(urlBase, data);
			},
			settingController: function(action, type){
				// removes white spaces
				type = type.replace(/\s/g, '');
				return action + type + 'DialogController';
			},
			settingDialogTemplate: function(action, type){
				if(type == 'Designers' || type == 'Quality Control'){
					return action + '-users-dialog.template.html';
				}

				// replaces white spaces with dashes and lower cases all captial letters
				type = type.replace(/\s+/g, '-').toLowerCase();

				return action + '-' + type + '-dialog.template.html';
			},
			fabCreateSuccessMessage: function(type){
				if(type == 'Categories'){
					var message = 'A new category has been added.'
				}
				else if(type == 'Clients'){
					var message = 'A new client has been added.'
				}
				else if(type == 'Designers'){
					var message = 'A new designer has been added to your team.'
				}
				else if(type == 'Quality Control'){
					var message = 'A new quality control has been added to your team.'
				}

				return $mdToast.show(
			    	$mdToast.simple()
				        .textContent(message)
				        .position('bottom right')
				        .hideDelay(3000)
			    );
			},
			delete: function(type, item){
				var urlBase = type == 'Categories' ? 'category' : 'client';

				return $http.delete(urlBase + '/' + item.id);
			}
		}
	}]);
sharedModule
	.controller('itemActionsBottomSheetController', ['$scope', '$mdBottomSheet', 'Preloader', function($scope, $mdBottomSheet, Preloader){
		$scope.type = Preloader.get();

		$scope.action = function(idx){
			$mdBottomSheet.hide(idx);
		}
	}]);
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
sharedModule
	.controller('createCategoriesDialogController', ['$scope', '$mdDialog', 'Preloader', 'Category', function($scope, $mdDialog, Preloader, Category){
		var urlBase = 'category';
		$scope.category = {};
		$scope.busy = false;
		$scope.duplicate = false;

		$scope.checkDuplicate = function(){
			Preloader.checkDuplicate(urlBase, $scope.category)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.categoryForm.$invalid){
				angular.forEach($scope.categoryForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate){
				$scope.busy = true;
				Category.store($scope.category)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('createClientsDialogController', ['$scope', '$mdDialog', 'Preloader', 'Client', function($scope, $mdDialog, Preloader, Client){
		var urlBase = 'client';
		$scope.client = {};
		$scope.busy = false;
		$scope.duplicate = false;

		$scope.checkDuplicate = function(){
			Preloader.checkDuplicate(urlBase, $scope.client)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.clientForm.$invalid){
				angular.forEach($scope.clientForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate){
				$scope.busy = true;
				Client.store($scope.client)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('createTasksDialogController', ['$scope', '$mdDialog', 'Preloader', 'Category', 'Client', 'Task', function($scope, $mdDialog, Preloader, Category, Client, Task){
		var urlBase = 'task';
		$scope.task = {};
		$scope.task.delivery_date = new Date();
		$scope.task.live_date = new Date();
		$scope.busy = false;
		$scope.duplicate = false;

		Category.index()
			.success(function(data){
				$scope.categories = data;
			})

		Client.index()
			.success(function(data){
				$scope.clients = data;
			})

		$scope.checkDuplicate = function(){
			Preloader.checkDuplicate(urlBase, $scope.task)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.taskForm.$invalid){
				angular.forEach($scope.taskForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate){
				$scope.busy = true;
				
				$scope.task.delivery_date = $scope.task.delivery_date.toDateString();
				$scope.task.live_date = $scope.task.live_date.toDateString();

				Task.store($scope.task)
					.success(function(data){
						if(typeof data === 'boolean'){
							$scope.busy = false;
							return;
						}

						Preloader.stop(data);
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('editCategoriesDialogController', ['$scope', '$mdDialog', 'Preloader', 'Category', function($scope, $mdDialog, Preloader, Category){
		var urlBase = 'category';
		
		Category.show(Preloader.get().id)
			.success(function(data){
				$scope.category = data;
				$scope.label = data.name;
			})

		$scope.busy = false;
		$scope.duplicate = false;

		$scope.checkDuplicate = function(){
			Preloader.checkDuplicate(urlBase, $scope.category)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.categoryForm.$invalid){
				angular.forEach($scope.categoryForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate){
				$scope.busy = true;
				Category.update($scope.category.id, $scope.category)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('editClientsDialogController', ['$scope', '$mdDialog', 'Preloader', 'Client', function($scope, $mdDialog, Preloader, Client){
		var urlBase = 'client';
		
		Client.show(Preloader.get().id)
			.success(function(data){
				$scope.client = data;
				$scope.label = data.name;
			})

		$scope.busy = false;
		$scope.duplicate = false;

		$scope.checkDuplicate = function(){
			Preloader.checkDuplicate(urlBase, $scope.client)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.clientForm.$invalid){
				angular.forEach($scope.clientForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate){
				$scope.busy = true;
				Client.update($scope.client.id, $scope.client)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('itemActionsDialogController', ['$scope', '$mdDialog', 'Preloader', function($scope, $mdDialog, Preloader){
		$scope.type = Preloader.get();

		$scope.action = function(idx){
			$mdDialog.hide(idx);
		}
	}]);
sharedModule
	.controller('reassignTasksDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', 'DesignerAssigned', function($scope, $mdDialog, Preloader, User, DesignerAssigned){
		$scope.task = Preloader.get();
		$scope.designer = $scope.task.designer_assigned.designer.id;
		$scope.busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.setDesigner = function(){
			$scope.task.designer_id = $scope.designer;
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
				DesignerAssigned.update($scope.task.id, $scope.task)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('customNotificationToastController', ['$scope', '$mdToast', '$state', 'Preloader', 'Notification', function($scope, $mdToast, $state, Preloader, Notification){
		$scope.notification = Preloader.get();

		console.log($scope.notification);

		$scope.notification.first_letter = $scope.notification.sender.name.charAt(0).toUpperCase();
		$scope.notification.sender = $scope.notification.sender.name;
		$scope.notification.created_at = new Date($scope.notification.data.created_at);
	}]);
//# sourceMappingURL=shared.js.map
