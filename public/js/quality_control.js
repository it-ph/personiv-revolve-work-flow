var qualityControlModule = angular.module('quality_control', ['sharedModule']);
qualityControlModule
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'sharedMainViewController',
					},
					'content-container@main': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'sharedDashboardContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main':{
						templateUrl: '/app/components/admin/templates/content/content.template.html',
					}
				}
			})
			.state('main.settings', {
				url: 'settings',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'settingsContentContainerController',
					},
					'toolbar@main.settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.settings': {
						templateUrl: '/app/components/admin/templates/subheaders/settings-subheader.template.html',
					},
					'content@main.settings':{
						templateUrl: '/app/components/admin/templates/content/settings-content.template.html',
					},
				}
			})
			.state('main.tracker', {
				url: 'tracker',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'trackerContentContainerController',
					},
					'toolbar@main.tracker': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.tracker': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.tracker': {
						templateUrl: '/app/shared/templates/subheaders/tracker-subheader.template.html',
					},
					'content@main.tracker':{
						templateUrl: '/app/shared/templates/content/tracker-content.template.html',
					},
				}
			})
			.state('main.upload', {
				url: 'upload',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'uploadContentContainerController',
					},
					'toolbar@main.upload': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.upload': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.upload':{
						templateUrl: '/app/components/admin/templates/content/upload-content.template.html',
					},
				}
			})
			.state('main.sheets', {
				url: 'sheets',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'sheetsContentContainerController',
					},
					'toolbar@main.sheets': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.sheets': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.sheets': {
						templateUrl: '/app/components/admin/templates/subheaders/sheets-subheader.template.html',
					},
					'content@main.sheets':{
						templateUrl: '/app/components/admin/templates/content/sheets-content.template.html',
					},
				}
			})
			.state('main.task', {
				url: 'task/{taskID}',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'taskContentContainerController',
					},
					'toolbar@main.task': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.task': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.task':{
						templateUrl: '/app/shared/templates/content/task-content.template.html',
					},
				}
			})
	}]);
qualityControlModule
	.controller('settingsContentContainerController', ['$scope', '$filter', '$timeout', '$mdDialog', '$mdToast', '$mdBottomSheet', '$mdMedia', 'Preloader', 'Setting', 'User', function($scope, $filter, $timeout, $mdDialog, $mdToast, $mdBottomSheet, $mdMedia, Preloader, Setting, User){
		$scope.toolbar = {};

		$scope.toolbar.childState = 'Settings';

		$scope.toolbar.getItems = function(query){
			$scope.showInactive = true;
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}
		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.type.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.type.busy = false;
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			$scope.showInactive = false;
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.type.page = 1;
				$scope.type.no_matches = false;
				$scope.type.items = [];
				$scope.searched = false;
			}
		};
		
		$scope.searchUserInput = function(){
			$scope.type.busy = true;
			$scope.isLoading = true;
  			$scope.type.show = false;
  			
  			$scope.query = {};
  			$scope.query.searchText = $scope.toolbar.searchText;
  			$scope.query.withTrashed = true;

  			Setting.search($scope.subheader.currentNavItem, $scope.query)
  				.success(function(data){
  					$scope.toolbar.items = [];
  					if(data.length){
	  					angular.forEach(data, function(item){
	  						pushItem(item);
	  					});
	  					$scope.type.items = data;
  					}
  					else{
  						$scope.type.items = [];	
	  					$scope.type.no_matches = true;
  					}
  					$scope.searched = true;
  					$scope.type.show = true;
  					$scope.isLoading = false;
  				})
				.error(function(data){
					Preloader.error();
				});
		};

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		
		/* Sets up the page for what tab it is*/
		var setInit = function(item){
			var action = 'create';
			var settingController = Setting.settingController(action, item);
			var settingDialogTemplate = Setting.settingDialogTemplate(action, item);

			$scope.fab.label = item;

			/* Create */
			$scope.fab.action = function(){
				$mdDialog.show({
			      	controller: settingController,
			      	templateUrl: '/app/components/admin/templates/dialogs/' + settingDialogTemplate,
			      	parent: angular.element(document.body),
			      	fullscreen: true,
			    })
			    .then(function() {
			    	$scope.type.busy = true;
			    	$scope.isLoading = true;
	      			$scope.type.show = false;
				    /* Refreshes the list*/
				    Setting.fabCreateSuccessMessage(item)
				    	.then(function(){
						    $scope.init($scope.subheader.currentNavItem);
				    	})
			    }, function() {
			    	return;
			    });
			}

			$scope.toolbar.items = [];
			
			$scope.init(item);
			
			$scope.item_menu = [
				{
					'label': 'Edit',
					'icon': 'mdi-pencil',
					action: function(item){
						var action = 'edit';
						var settingController = Setting.settingController(action, $scope.subheader.currentNavItem);
						var settingDialogTemplate = Setting.settingDialogTemplate(action, $scope.subheader.currentNavItem);

						Preloader.set(item);
						$mdDialog.show({
					      	controller: settingController,
					      	templateUrl: '/app/components/admin/templates/dialogs/' + settingDialogTemplate,
					      	parent: angular.element(document.body),
					      	fullscreen: true,
					    })
					    .then(function() {
					    	$scope.type.busy = true;
			      			$scope.isLoading = true;
			      			$scope.type.show = false;
						    /* Refreshes the list*/
						    var message = item.name + ' has been updated.';
						    Preloader.notify(message)
							    .then(function(){	
					      			$scope.init($scope.subheader.currentNavItem)
				      			});
					    }, function() {
					    	return;
					    });
					}, 
				},
				{
					'label': 'Delete',
					'icon': 'mdi-delete',
					action: function(item){
						var confirm = $mdDialog.confirm()
				        	.title('Delete')
				          	.textContent('Delete ' + item.name + '?')
				          	.ariaLabel('Delete')
				          	.ok('Delete')
				          	.cancel('Cancel');

				        $mdDialog.show(confirm).then(function() {
			      			$scope.type.busy = true;
			      			$scope.isLoading = true;
			      			$scope.type.show = false;
					      	/* Disables account of the user */
					      	Setting.delete($scope.subheader.currentNavItem, item)
					      		.success(function(){
					      			var message = item.name + ' has been removed.'
					      			Preloader.notify(message)
						      			.then(function(){	
							      			$scope.init($scope.subheader.currentNavItem)
						      			});
					      		})
					      		.error(function(){
					      			Preloader.error();
					      		});
					    }, function() {
					      	return;
					    });
					}, 
				},
			];
			
		}

		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};

		$scope.subheader.show = true;

		$scope.subheader.navs = [
			{
				'label':'Categories',
				action: function(){
					setInit(this.label);
				},
			},
			{
				'label':'Clients',
				action: function(){
					setInit(this.label);
				},
			},
		];

		$scope.subheader.sort = [
			{
				'label': 'Name',
				'type': 'name',
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
  			$scope.type.show = false;

  			$scope.init($scope.subheader.currentNavItem);
		}

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}

		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		$scope.showOptions = function(type){
			if(type.deleted_at){
				return;
			}

			type.item_menu = $scope.item_menu;
			/* Set the item */
			Preloader.set(type);

			/* Only opens on mobile devices */
			if($mdMedia('xs') || $mdMedia('sm')){
				$scope.fab.show = false;

				$mdBottomSheet.show({
				    templateUrl: '/app/shared/templates/bottom-sheets/item-actions-bottom-sheet.template.html',
				    controller: 'itemActionsBottomSheetController'
				}).then(function(idx) {
					/* Executes the action in item_menu*/
				    $scope.item_menu[idx].action(type);
				}, function(){
					$scope.fab.show = true;
				});
			}
			/* Opens in tablets and other devices with larger screens*/
			else{
				$mdDialog.show({
			      	controller: 'itemActionsDialogController',
			      	templateUrl: '/app/shared/templates/dialogs/item-actions-dialog.template.html',
			      	parent: angular.element(document.body),
			      	clickOutsideToClose:true,
			      	// fullscreen: true,
			    })
			    .then(function(idx) {
				    /* Executes the action in item_menu*/
				    $scope.item_menu[idx].action(type);
			    }, function() {
			    	return;
			    });
			}
		}

		/**
		 * Object for rightSidenav
		 *
		*/
		$scope.rightSidenav = {};

		$scope.rightSidenav.show = false;

		var pushItem = function(item){
			item.first_letter = item.name.charAt(0).toUpperCase();
			item.created_at = new Date(item.created_at);
			item.deleted_at = item.deleted_at ? new Date(item.deleted_at) : null;

			var filter = {};
			filter.display = item.name;

			$scope.toolbar.items.push(filter);
		}

		$scope.init = function(request){
			$scope.type = {};
			$scope.type.items = [];

			if($scope.searched)
			{
				$scope.searchBar = false;
				$scope.toolbar.searchText = '';
				$scope.toolbar.searchItem = '';
				$scope.type.page = 1;
				$scope.type.no_matches = false;
				$scope.searched = false;
			}

			// 2 is default so the next page to be loaded will be page 2 
			$scope.type.page = 2;

			Setting.paginate(request)
				.success(function(data){
					$scope.type.details = data;
					$scope.type.items = data.data;
					$scope.type.show = true;

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

					$scope.type.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.type.busy || ($scope.type.page > $scope.type.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.type.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Setting.paginate(request, $scope.type.page)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.type.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.type.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.type.busy = false;
								$scope.isLoading = false;
							});
					}
				})
		};

		$scope.subheader.currentNavItem = $scope.subheader.navs[0].label;

		$scope.fab.label = $scope.subheader.navs[0].label;
		
		/* Sets up the page for what tab it is*/
		setInit($scope.subheader.currentNavItem);

	}]);
//# sourceMappingURL=quality_control.js.map
