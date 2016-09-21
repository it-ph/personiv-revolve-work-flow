designerModule
	.controller('mainViewController', ['$scope', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'User', 'Preloader', 'Notification', function($scope, $state, $mdDialog, $mdSidenav, $mdToast, User, Preloader, Notification){
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
				'state': 'main.tracker',
				'icon': 'mdi-view-list',
				'label': 'Tracker',
			},
			{
				'state': 'main.notifications',
				'icon': 'mdi-bell',
				'label': 'Notifications',
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

				if(notif.type == 'App\\Notifications\\NotifyDesignerForNewTask'){
					notif.message = 'assigned a task for you.';
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

				else if(notif.type == 'App\\Notifications\\NotifyDesignerForCompleteTask'){
					notif.message = 'marked your task ' + notif.data.attachment.file_name + ' as complete.';
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
					notif.message = 'commented on your task on ' + notif.data.attachment.file_name + '.';
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

				channel.designer = pusher.subscribe('designer');
				channel.user = pusher.subscribe('user.' + $scope.user.id);					
				
			    channel.user.bindings = [
				    channel.user.bind('App\\Events\\PusherNotifyDesignerForNewTask', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' assigned a task for you.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherNotifyDesignerForCompleteTask', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' marked your task ' + data.data.file_name + ' as complete.';
				    	Preloader.newNotification(message);
						$scope.$broadcast('refresh');
				    }),

				    channel.user.bind('App\\Events\\PusherNotifyComment', function(data) {
				    	fetchUnreadNotifications();
				    	var message = data.sender.name + ' commented on your task on ' + data.data.file_name + '.';
				    	Preloader.newNotification(message);
				    	$scope.$broadcast('refresh');
				    }),
			    ];
			})
	}]);