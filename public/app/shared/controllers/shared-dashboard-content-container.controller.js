sharedModule
	.controller('sharedDashboardContentContainerController', ['$scope', 'Preloader', 'User', function($scope, Preloader, User){
		$scope.toolbar = {};

		$scope.toolbar.childState = 'Dashboard';
	}]);