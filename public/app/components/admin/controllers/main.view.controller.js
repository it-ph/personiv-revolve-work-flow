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
				'state': 'main.tasks',
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
			})
	}]);