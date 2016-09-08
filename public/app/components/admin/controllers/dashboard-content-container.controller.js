adminModule
	.controller('dashboardContentContainerController', ['$scope', 'Preloader', 'User', function($scope, Preloader, User){
		$scope.toolbar = {};

		$scope.toolbar.childState = 'Dashboard';

		$scope.toolbar.items = [];
		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}
		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			// $scope.workStation.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			// $scope.workStation.busy = false;
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
	    	// if($scope.workStation.searched){
	    	// 	$scope.toolbar.refresh();
	    	// 	$scope.workStation.searched = false;
	    	// }
		};
		
		$scope.searchUserInput = function(){
			// $scope.workStation.paginated.show = false;
			Preloader.preload();
			// WorkStation.search($scope.toolbar)
			// 	.success(function(data){
			// 		angular.forEach(data, function(item){
			// 			pushItem(item);
			// 		})
			// 		$scope.workStation.results = data;
			// 		Preloader.stop();
			// 		$scope.workStation.searched = true;
			// 	})
			// 	.error(function(data){
			// 		Preloader.error();
			// 	});
		};

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Work Station';
		// $scope.fab.show = true;

		$scope.fab.action = function(){
			// $scope.createWorkStation();			
		};


		/**
		 * Object for rightSidenav
		 *
		*/
		$scope.rightSidenav = {};

		$scope.rightSidenav.show = false;

		var pushItem = function(item){
			item.first_letter = item.name.charAt(0).toUpperCase();
		}

		$scope.init = function(){
			// $scope.user = {};
			// $scope.user.paginated = [];

			// // 2 is default so the next page to be loaded will be page 2 
			// $scope.user.page = 2;

			// User.paginate()
			// 	.success(function(data){
			// 		$scope.user.details = data;
			// 		$scope.user.paginated = data.data;
			// 		$scope.user.paginated.show = true;

			// 		if(data.data.length){
			// 			// iterate over each record and set the updated_at date and first letter
			// 			angular.forEach(data.data, function(item){
			// 				pushItem(item);
			// 			});

			// 			$scope.fab.show = true;
			// 		}

			// 		$scope.user.paginateLoad = function(){
			// 			// kills the function if ajax is busy or pagination reaches last page
			// 			if($scope.user.busy || ($scope.user.page > $scope.user.details.last_page)){
			// 				return;
			// 			}
			// 			/**
			// 			 * Executes pagination call
			// 			 *
			// 			*/
			// 			// sets to true to disable pagination call if still busy.
			// 			$scope.user.busy = true;
			// 			// Calls the next page of pagination.
			// 			User.paginate($scope.user.page)
			// 				.success(function(data){
			// 					// increment the page to set up next page for next AJAX Call
			// 					$scope.user.page++;

			// 					// iterate over each data then splice it to the data array
			// 					angular.forEach(data.data, function(item, key){
			// 						pushItem(item);
			// 						$scope.user.paginated.push(item);
			// 					});

			// 					// Enables again the pagination call for next call.
			// 					$scope.user.busy = false;
			// 				});
			// 		}
			// 	})
		}();
	}]);