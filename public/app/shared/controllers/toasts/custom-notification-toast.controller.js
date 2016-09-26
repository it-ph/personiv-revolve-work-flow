sharedModule
	.controller('customNotificationToastController', ['$scope', '$mdToast', '$state', 'Preloader', 'Notification', function($scope, $mdToast, $state, Preloader, Notification){
		$scope.notification = Preloader.get();

		console.log($scope.notification);

		$scope.notification.first_letter = $scope.notification.sender.name.charAt(0).toUpperCase();
		$scope.notification.sender = $scope.notification.sender.name;
		$scope.notification.created_at = new Date($scope.notification.data.created_at);
	}]);