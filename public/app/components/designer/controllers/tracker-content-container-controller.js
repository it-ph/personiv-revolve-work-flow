designerModule
	.controller('trackerContentContainerController', ['$scope', '$state', '$filter', '$timeout', '$mdDialog', '$mdToast', '$mdBottomSheet', '$mdMedia', 'Preloader', 'Category', 'Client', 'DesignerAssigned', 'User', function($scope, $state, $filter, $timeout, $mdDialog, $mdToast, $mdBottomSheet, $mdMedia, Preloader, Category, Client, DesignerAssigned, User){
		$scope.toolbar = {};

		$scope.toolbar.childState = 'Tracker';

		$scope.toolbar.getItems = function(query){
			$scope.showInactive = true;
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}
		$scope.toolbar.searchAll = true;

		$scope.$on('refresh', function(){
			$scope.init($scope.subheader.current.request);
		});
		
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
			$scope.showInactive = false;
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.task.page = 1;
				$scope.task.no_matches = false;
				$scope.task.items = [];
				$scope.searched = false;

				$scope.init($scope.subheader.current.request);
			}
		};
		
		$scope.searchUserInput = function(){
			$scope.isLoading = true;
  			$scope.task.show = false;
  			$scope.searched = true;
  			$scope.init($scope.subheader.current.request, true);
		};

		/* Sets up the page for what tab it is*/
		var setInit = function(nav){
			$scope.subheader.current = nav;

			$scope.toolbar.items = [];
			
			$scope.init($scope.subheader.current.request);
		}

		$scope.fab = {};

		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};

		$scope.subheader.show = true;

		$scope.subheader.navs = [
			{
				'label':'Pending',
				'request': {
					'withTask': [
						{
							'relation' : 'category',
							'withTrashed': true,
						},
						{
							'relation' : 'client',
							'withTrashed': true,
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'pending',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Batch start',
						'icon': 'mdi-timer',
						action: function(){
							$scope.selectMultiple = true;
							$scope.fab.label = 'Start';
							$scope.fab.icon = this.icon;
							$scope.fab.show = true;
							$scope.fab.action = function(){
								Preloader.set($scope.task.items);
								$mdDialog.show({
							      	controller: 'batchStartTaskDialogController',
							      	templateUrl: '/app/shared/templates/dialogs/batch-action-task-dialog.template.html',
							      	parent: angular.element(document.body),
							      	fullscreen: true,
							    })
							    .then(function(){
							    	$scope.selectMultiple = false;
							    	$scope.fab.show = false;
									$scope.subheader.refresh();
							    })
							}
						},
					},
				],
			},
			{
				'label':'In Progress',
				'request': {
					'withTask': [
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
							'with': [
								{
									'relation' : 'designer',
									'withTrashed': true,
								},
								{
									'relation' : 'quality_control',
									'withTrashed': true,
								},
							]
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'in_progress',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Batch For QC',
						'icon': 'mdi-timer-off',
						action: function(){
							$scope.selectForQC = true;
							$scope.fab.label = 'For QC';
							$scope.fab.icon = this.icon;
							$scope.fab.show = true;
							$scope.fab.action = function(){
								Preloader.set($scope.task.items);
								$mdDialog.show({
							      	controller: 'batchForQCDialogController',
							      	templateUrl: '/app/shared/templates/dialogs/batch-action-task-dialog.template.html',
							      	parent: angular.element(document.body),
							      	fullscreen: true,
							    })
							    .then(function(){
							    	$scope.selectForQC = false;
							    	$scope.fab.show = false;
									$scope.subheader.refresh();
							    })
							}
						},
					},
					{
						'label': 'Batch For QC Revised',
						'icon': 'mdi-repeat-off',
						action: function(){
							$scope.selectRework = true;
							$scope.fab.label = 'For QC Revised';
							$scope.fab.icon = this.icon;
							$scope.fab.show = true;
							$scope.fab.action = function(){
								Preloader.set($scope.task.items);
								$mdDialog.show({
							      	controller: 'batchForQCRevisedDialogController',
							      	templateUrl: '/app/shared/templates/dialogs/batch-action-task-dialog.template.html',
							      	parent: angular.element(document.body),
							      	fullscreen: true,
							    })
							    .then(function(){
							    	$scope.selectRework = false;
							    	$scope.fab.show = false;
									$scope.subheader.refresh();
							    })
							}
						},
					},
				],
			},
			{
				'label':'For QC',
				'request': {
					'withTask': [
						{
							'relation' : 'category',
							'withTrashed': true,
						},
						{
							'relation' : 'client',
							'withTrashed': true,
						},
						{
							'relation': 'quality_control_assigned',
							'withTrashed': false,
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'for_qc',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
			},
			{
				'label':'Rework',
				'request': {
					'withTask': [
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
							'with': [
								{
									'relation' : 'designer',
									'withTrashed': true,
								},
								{
									'relation' : 'quality_control',
									'withTrashed': true,
								},
							]
						},
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'rework',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Batch revise',
						'icon': 'mdi-timer',
						action: function(){
							$scope.selectMultiple = true;
							$scope.fab.label = 'Revise';
							$scope.fab.icon = this.icon;
							$scope.fab.show = true;
							$scope.fab.action = function(){
								Preloader.set($scope.task.items);
								$mdDialog.show({
							      	controller: 'batchReviseTaskDialogController',
							      	templateUrl: '/app/shared/templates/dialogs/batch-action-task-dialog.template.html',
							      	parent: angular.element(document.body),
							      	fullscreen: true,
							    })
							    .then(function(){
							    	$scope.selectMultiple = false;
							    	$scope.fab.show = false;
									$scope.subheader.refresh();
							    })
							}
						},
					},
				],
			},
			{
				'label':'Complete',
				'request': {
					'withTask': [
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
					],
					'where': [
						{
							'label':'status',
							'condition': '=',
							'value': 'complete',
						},
					],
					'paginate': 20,
				},
				action: function(current){
					setInit(current);
				},
			},
		];

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

		$scope.subheader.mark = {};
		$scope.subheader.mark.all = false;
		$scope.subheader.mark.icon = 'mdi-checkbox-blank-outline';
		$scope.subheader.mark.label = 'Check all';

		$scope.subheader.toggleMark = function(){
			$scope.subheader.mark.all = !$scope.subheader.mark.all;
			$scope.subheader.mark.icon = $scope.subheader.mark.all ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline';
			$scope.subheader.mark.label = $scope.subheader.mark.all ? 'Uncheck all' : 'Check all';
			angular.forEach($scope.task.items, function(item){
				item.include = $scope.subheader.mark.all;
			});
		}

		$scope.subheader.cancelSelectMultiple = function(){
			$scope.selectMultiple = false;
			$scope.selectForQC = false;
			$scope.selectRework = false;
			$scope.fab.show = false;
			$scope.subheader.mark.all = false;
			$scope.subheader.mark.icon = 'mdi-checkbox-blank-outline';
			$scope.subheader.mark.label = 'Check all';

			angular.forEach($scope.task.items, function(item){
				item.include = false;
			});
		}

		$scope.subheader.refresh = function(){
			$scope.isLoading = true;
  			$scope.task.show = false;

  			$scope.init($scope.subheader.current.request);
		}

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
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

		/**
		 * Object for rightSidenav
		 *
		*/
		$scope.rightSidenav = {};

		$scope.rightSidenav.show = false;

		var pushItem = function(item){
			item.first_letter = item.file_name.charAt(0).toUpperCase();
			item.created_at = new Date(item.created_at);
			item.updated_at = new Date(item.updated_at);
			item.delivery_date = new Date(item.delivery_date);
			item.live_date = new Date(item.live_date);
			item.category = item.category.name;
			item.client = item.client.name;

			var filter = {};
			filter.display = item.file_name;

			$scope.toolbar.items.push(filter);
			$scope.task.items.push(item);
		}

		$scope.init = function(request, searched){
			$scope.selectMultiple = false;
			$scope.selectForQC = false;
			$scope.selectRework = false;
			
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

			if(searched)
			{
	  			request.searchText = $scope.toolbar.searchText;
			}
			else{
				$scope.searchBar = false;
				$scope.toolbar.searchText = '';
				$scope.toolbar.searchItem = '';
				$scope.task.page = 1;
				$scope.task.no_matches = false;
				$scope.searched = false;
				request.searchText = null;
			}

			// 2 is default so the next page to be loaded will be page 2 
			$scope.task.page = 2;

			DesignerAssigned.paginate(request)
				.success(function(data){
					if(!data)
					{
						$scope.task.show = true;
						return;
					}
					
					$scope.task.details = data;
					$scope.task.show = true;

					// Hides inactive records
					$scope.showInactive = false;

					if(data.data.length){
						// iterate over each record and set the updated_at date and first letter
						angular.forEach(data.data, function(item){
							if(item.task)
							{
								pushItem(item.task);
							}
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
						DesignerAssigned.paginate(request, $scope.task.page)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.task.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									if(item.task)
									{
										pushItem(item.task);
									}
								});

								// Enables again the pagination call for next call.
								$scope.task.busy = false;
								$scope.isLoading = false;
							});
					}
				})
		};

		$scope.subheader.currentNavItem = $scope.subheader.navs[0].label;
		
		/* Sets up the page for what tab it is*/
		setInit($scope.subheader.navs[0]);

	}]);