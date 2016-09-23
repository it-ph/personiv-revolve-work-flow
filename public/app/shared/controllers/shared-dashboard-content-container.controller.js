sharedModule
	.controller('sharedDashboardContentContainerController', ['$scope', '$filter', '$state', '$mdDialog', 'Preloader', 'Category', 'Client', 'Task', function($scope, $filter, $state, $mdDialog, Preloader, Category, Client, Task){
		$scope.$on('refresh', function(){
			$scope.init($scope.subheader.current.request);
		});

		$scope.toolbar = {};

		$scope.toolbar.childState = 'Dashboard';

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.task.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.task.busy = false;
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
		};

		/* Sets up the page for what tab it is*/
		var setInit = function(nav){
			$scope.subheader.current = nav;

			$scope.toolbar.items = [];
			
			$scope.init($scope.subheader.current.request);
		}

		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};

		$scope.subheader.show = true;

		$scope.subheader.sort = [
			{
				'label': 'File Name',
				'type': 'file_name',
				'sortReverse': false,
			},
			{
				'label': 'Category',
				'type': 'category',
				'sortReverse': false,
			},
			{
				'label': 'Delivery Date',
				'type': 'delivery_date',
				'sortReverse': false,
			},
			{
				'label': 'Live Date',
				'type': 'live_date',
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
  			$scope.task.show = false;

  			$scope.init($scope.subheader.current.request);
		}

		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		$scope.subheader.setCategoryFilter = function(filter){
			if($scope.categoryFilter == filter)
			{
				return $scope.categoryFilter = '';
			}

			$scope.categoryFilter = filter;
		}

		$scope.subheader.setClientFilter = function(filter){
			if($scope.clientFilter == filter)
			{
				return $scope.clientFilter = '';
			}

			$scope.clientFilter = filter;
		}

		var pushNavs = function(data){
			var item = {
				'label': data.label,
				'request': {
					'withTrashed': false,
					'with': [
						{
							'relation' : 'category',
							'withTrashed': true,
						},
						{
							'relation' : 'client',
							'withTrashed': true,
						},
						{
							'relation': 'designer_assigned',
							'withTrashed': false,
						},
						{
							'relation': 'quality_control_assigned',
							'withTrashed': false,
						},
						{
							'relation': 'reworks',
							'withTrashed': false,
						},
					],
					'whereBetween':
					{
						'label':'updated_at',
						'start': data.start,
						'end': data.end,
					},
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'complete',
						},
					],
					'paginate': 100,
				},
				'menu': [
					{
						'label': 'Download',
						'icon': 'mdi-download',
						action: function(){
							$mdDialog.show({
						      	controller: 'downloadDialogController',
						      	templateUrl: '/app/shared/templates/dialogs/download-dialog.template.html',
						      	parent: angular.element(document.body),
						      	fullscreen: true,
						    })
						    .then(function(){
						    })
						},
					},
				],
				action: function(current){
					setInit(current);
				},
			}

			$scope.subheader.navs.push(item);
		}

		var days = [
			{
				'label': 'Monday',
			},
			{
				'label': 'Tuesday',
			},
			{
				'label': 'Wednesday',
			},
			{
				'label': 'Thursday',
			},
			{
				'label': 'Friday',
			},
			{
				'label': 'Saturday',
			},
		];

		var getMonday = function(d){
			d = new Date(d);
			var day = d.getDay(),
			diff = d.getDate() - day + (day == 0 ? -6:1);
			return new Date(d.setDate(diff));
		}

		$scope.fetchDays = function(date)
		{
			var d = new Date(date);

			$scope.subheader.navs = [];

			angular.forEach(days, function(item, key){
				item.start = new Date();
				item.start.setDate(d.getDate() + key);

				item.end = new Date();
				item.end.setDate(item.start.getDate() + 1);

				item.start = item.start.toDateString();
				item.end = item.end.toDateString();

				pushNavs(item);
			});

			if($scope.subheader.currentNavItem)
			{
				$scope.subheader.currentNavItem = $scope.subheader.navs[today.getDay() - 1].label;

				/* Sets up the page for what tab it is*/
				setInit($scope.subheader.navs[today.getDay() - 1]);
			}		
		}

		$scope.date_start = getMonday(new Date());
		$scope.fetchDays($scope.date_start);
		
		$scope.mondaysOnly = function(date) {
		    var day = date.getDay();
		    return day === 1;
		};

		var today = new Date();

		var pushItem = function(item){
			item.first_letter = item.file_name.charAt(0).toUpperCase();
			item.created_at = new Date(item.created_at);
			item.updated_at = new Date(item.updated_at);
			item.delivery_date = new Date(item.delivery_date);
			item.live_date = new Date(item.live_date);
			item.deleted_at = item.deleted_at ? new Date(item.deleted_at) : null;
			item.category = item.category.name;
			item.client = item.client.name;

			var filter = {};
			filter.display = item.file_name;

			$scope.toolbar.items.push(filter);
		}

		$scope.viewTask = function(id)
		{
			$state.go('main.task', {'taskID':id});
		}

		$scope.init = function(request){
			Category.index()
				.success(function(data){
					$scope.categories = data;
				})

			Client.index()
				.success(function(data){
					$scope.clients = data;
				})

			$scope.task = {};
			$scope.task.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.task.page = 2;

			Task.enlist(request)
				.success(function(data){
					if(!data)
					{
						$scope.task.show = true;
						return;
					}
					
					$scope.task.details = data;
					$scope.task.items = data.data;
					$scope.task.show = true;

					if(data.data.length){
						// iterate over each record and set the updated_at date and first letter
						angular.forEach(data.data, function(item){
							pushItem(item);
						});

					}

					$scope.task.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.task.busy || ($scope.task.page > $scope.task.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.task.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Task.enlist(request, $scope.task.page)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.task.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.task.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.task.busy = false;
								$scope.isLoading = false;
							});
					}
				})
		}

		$scope.subheader.currentNavItem = $scope.subheader.navs[today.getDay() - 1].label;

		/* Sets up the page for what tab it is*/
		setInit($scope.subheader.navs[today.getDay() - 1]);
	}]);