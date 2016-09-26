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
				'state': 'main.upload',
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
					notif.message = 'marked ' + notif.data.attachment.file_name + ' as complete.';
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
					notif.message = 'marked ' + notif.data.attachment.file_name + ' as rework.';
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

				else if(notif.type == 'App\\Notifications\\DesignerRevisionStart'){
					notif.message = 'started to revise ' + notif.data.attachment.task.file_name + '.';
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

				    channel.user.bind('App\\Events\\PusherDesignerRevisionStart', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' started to revise ' + data.data.file_name + '.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),
			    ];
			})
	}]);