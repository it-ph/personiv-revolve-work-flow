adminModule
	.controller('itemActionsBottomSheetController', ['$scope', '$mdBottomSheet', 'Preloader', function($scope, $mdBottomSheet, Preloader){
		$scope.type = Preloader.get();

		$scope.action = function(idx){
			$mdBottomSheet.hide(idx);
		}
	}]);