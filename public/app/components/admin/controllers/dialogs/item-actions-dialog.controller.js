adminModule
	.controller('itemActionsDialogController', ['$scope', '$mdDialog', 'Preloader', function($scope, $mdDialog, Preloader){
		$scope.type = Preloader.get();

		$scope.action = function(idx){
			$mdDialog.hide(idx);
		}
	}]);