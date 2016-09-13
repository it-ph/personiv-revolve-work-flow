adminModule
	.controller('mainViewController', ['$scope', '$mdDialog', '$mdSidenav', '$mdToast', 'User', 'Preloader', function($scope, $mdDialog, $mdSidenav, $mdToast, User, Preloader){
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

		User.check()
			.success(function(data){
				$scope.user = data;

				var pusher = new Pusher('58891c6a307bb58de62e', {
			    	encrypted: true
			    });

			    var channel = pusher.subscribe('admin');

			    channel.bind('App\\Event\\PusherTaskCreated', function(data) {
				    	console.log(data);
				    	// Preloader.setNotification(data.data);
				    	// // pops out the toast
				    	// $mdToast.show({
					    // 	controller: 'notificationToastController',
					    //   	templateUrl: '/app/components/admin/templates/toasts/notification.toast.html',
					    //   	parent : angular.element($('body')),
					    //   	hideDelay: 6000,
					    //   	position: 'bottom right'
					    // });
				    	// // updates the notification menu
				    	// Notification.unseen()
				    	// 	.success(function(data){
				    	// 		$scope.notifications = data;
				    	// 	});
				    });
			})
	}]);