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