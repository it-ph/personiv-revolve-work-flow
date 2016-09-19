var sharedModule = angular.module('sharedModule', [
	'ui.router',
	'ngMaterial',
	'ngMessages',
	'infinite-scroll',
	'chart.js',
	'angularMoment',
	'angularFileUpload'
]);
sharedModule
	.config(['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', function($urlRouterProvider, $stateProvider, $mdThemingProvider){
		/* Defaul Theme Blue - Light Blue */
		$mdThemingProvider.theme('default')
			.primaryPalette('light-blue')
			.accentPalette('pink')
		
		/* Dark Theme - Blue */
		$mdThemingProvider.theme('dark', 'default')
	      	.primaryPalette('blue')
			.dark();

		$urlRouterProvider
			.otherwise('/page-not-found')
			.when('', '/');

		$stateProvider
			.state('page-not-found',{
				url: '/page-not-found',
				templateUrl: '/app/shared/views/page-not-found.view.html',
			})
	}]);
sharedModule
	.controller('changePasswordDialogController', ['$scope', '$mdDialog', 'User', 'Preloader', function($scope, $mdDialog, User, Preloader){
		$scope.password = {};

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.checkPassword = function(){
			User.checkPassword($scope.password)
				.success(function(data){
					$scope.match = data;
					$scope.show = true;
				});
		}

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.changePasswordForm.$invalid){
				angular.forEach($scope.changePasswordForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else if($scope.password.old == $scope.password.new || $scope.password.new != $scope.password.confirm)
			{
				return;
			}
			else {
				$scope.busy = true;
				User.changePassword($scope.password)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('homePageController', ['$scope', function($scope){
		$scope.show = function(){
			angular.element(document.querySelector('.main-view')).removeClass('no-opacity');
		};
	}]);
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
sharedModule	
	.controller('taskContentContainerController', ['$scope', '$state', '$stateParams', 'Preloader', 'Task', 'DesignerAssigned', function($scope, $state, $stateParams, Preloader, Task, DesignerAssigned){
		var taskID = $stateParams.taskID;

		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Task';
		$scope.toolbar.back = function(){
			$state.go('main.tracker');
		};

		$scope.toolbar.showBack = true;

		$scope.toolbar.hideSearchIcon = true;

		// check the user if he has pending works

		$scope.start = function()
		{
			var dialog = {
				'title': 'Start',
				'message': 'Start on working this task?',
				'ok': 'start',
				'cancel': 'cancel',
			};

			Preloader.confirm(dialog)
				.then(function(){
					Task.started($scope.task)
						.success(function(data){
							$scope.init();
						})
						.error(function(){
							Preloader.error();
						})
				}, function(){
					return;
				})
		}

		$scope.init = function(){
			var query = {
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
						'with': [
							{
								'relation' : 'designer',
								'withTrashed': true,
							},
						]
					},
					{
						'relation': 'quality_control_assigned',
						'withTrashed': false,
						'with': [
							{
								'relation' : 'quality_control',
								'withTrashed': true,
							},
						]
					},
				],
				'where': [
					{
						'label':'id',
						'condition':'=',
						'value':taskID,
					},
				],
			};

			Task.enlist(query)
				.success(function(data){
					if(data.designer_assigned)
					{
						data.designer_assigned.time_start = data.designer_assigned.time_start ? new Date(data.designer_assigned.time_start) : null;
						data.designer_assigned.time_end = data.designer_assigned.time_end ? new Date(data.designer_assigned.time_end) : null;
					}
					if(data.quality_control)
					{
						data.quality_control_assigned.time_start = data.quality_control_assigned.time_start ? new Date(data.quality_control_assigned.time_start) : null;
						data.quality_control_assigned.time_end = data.quality_control_assigned.time_end ? new Date(data.quality_control_assigned.time_end) : null;
					}

					$scope.task = data;
					$scope.toolbar.childState = data.file_name;
				})
		}

		$scope.init();
	}]);
sharedModule
	.controller('trackerContentContainerController', ['$scope', '$state', '$filter', '$timeout', '$mdDialog', '$mdToast', '$mdBottomSheet', '$mdMedia', 'Preloader', 'Category', 'Client', 'Task', 'User', function($scope, $state, $filter, $timeout, $mdDialog, $mdToast, $mdBottomSheet, $mdMedia, Preloader, Category, Client, Task, User){
		$scope.toolbar = {};

		$scope.toolbar.childState = 'Tracker';

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

		var createTask = function(){
			$mdDialog.show({
		      	controller: 'createTasksDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/create-task-dialog.template.html',
		      	parent: angular.element(document.body),
		      	fullscreen: true,
		    })
		     .then(function(data) {
		     	pushItem(data);
		    	$scope.task.busy = true;
			    /* Refreshes the list*/
      			var message = 'A new task has been created.';
			    Preloader.notify(message)
			    	.then(function(){
				     	$scope.task.busy = false;
			    	})
		    }, function() {
		    	return;
		    });
		}

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Task';
		$scope.fab.action = createTask;

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

		$scope.subheader.navs = [
			{
				'label':'Pending',
				'request': {
					'withTrashed': true,
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
						'label': 'Assign multiple',
						'icon': 'mdi-tag-multiple',
						action: function(){
							$scope.selectMultiple = true;
							$scope.fab.label = 'Assign';
							$scope.fab.icon = this.icon;
							$scope.fab.action = function(){
								Preloader.set($scope.task.items);
								$mdDialog.show({
							      	controller: 'assignTasksDialogController',
							      	templateUrl: '/app/components/admin/templates/dialogs/assign-tasks-dialog.template.html',
							      	parent: angular.element(document.body),
							      	fullscreen: true,
							    })
							    .then(function(){
							    	$scope.selectMultiple = false;
							    	$scope.fab.label = 'Task';
									$scope.fab.icon = 'mdi-plus';
									$scope.fab.action = createTask;

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
			},
			{
				'label':'For QC',
				'request': {
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
			},
			{
				'label':'Complete',
				'request': {
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

		$scope.subheader.cancelSelectMultiple = function(){
			$scope.selectMultiple = false;
			$scope.fab.label = 'Task';
			$scope.fab.icon = 'mdi-plus';
			$scope.fab.action = createTask;

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
			item.deleted_at = item.deleted_at ? new Date(item.deleted_at) : null;
			item.category = item.category.name;
			item.client = item.client.name;

			var filter = {};
			filter.display = item.file_name;

			$scope.toolbar.items.push(filter);
		}

		$scope.init = function(request, searched){
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

			Task.paginate(request)
				.success(function(data){
					if(!data)
					{
						$scope.task.show = true;
						return;
					}
					
					$scope.task.details = data;
					$scope.task.items = data.data;
					$scope.task.show = true;

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
						Task.paginate(request, $scope.task.page)
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
		};

		$scope.subheader.currentNavItem = $scope.subheader.navs[0].label;
		
		/* Sets up the page for what tab it is*/
		setInit($scope.subheader.navs[0]);

	}]);
sharedModule
	.controller('uploadContentContainerController', ['$scope', '$filter', '$mdDialog', '$state', 'FileUploader', 'Preloader', 'Spreadsheet', 'Task', function($scope, $filter, $mdDialog, $state, FileUploader, Preloader, Spreadsheet, Task){
		$scope.toolbar = {};
		$scope.form = {};

		$scope.toolbar.items = [];
		$scope.toolbar.childState = 'Upload Sheet';

		$scope.toolbar.back = function(){
			$state.go('main.sheets');
		}

		$scope.toolbar.showBack = true;

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
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			$scope.searchBar = false;
		};

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Upload';

		var uploader = {};

		uploader.filter = {
            name: 'excelFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|'.indexOf(type) !== -1;
            }
        };

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.excelUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		/* Question Uploader */
		$scope.excelUploader = new FileUploader({
			url: '/spreadsheet',
			headers: uploader.headers,
			queueLimit : 1
		})
		// FILTERS
        $scope.excelUploader.filters.push(uploader.filter);
        
		$scope.excelUploader.onWhenAddingFileFailed = uploader.error;
		$scope.excelUploader.onAfterAddingFile  = function(){
			$scope.fileError = false;
			if($scope.excelUploader.queue.length)
			{	
				$scope.excelUploader.uploadAll()
			}
		};

		$scope.checkDuplicate = function(data){
			var nextLoop = true;
			var idx = $scope.tasks.indexOf(data);
			var duplicate = false;
			// checks for duplicate file name within the form.
			angular.forEach($scope.tasks, function(task, key){
				if(nextLoop && key != idx){
					console.log(data.file_name == task.file_name);
					if(data.file_name == task.file_name){
						duplicate = true;
						nextLoop = false;
					}
				}
			});

			if(duplicate){
				return data.duplicate = true;
			}
			else{
				data.duplicate = false;
			}

			Preloader.checkDuplicate('task', data)
				.success(function(bool){
					data.duplicate = bool;
				});
		}

		$scope.remove = function(data){
			var confirm = $mdDialog.confirm()
		        .title('Remove')
		        .textContent('Remove ' + data.file_name + ' from the list?')
		        .ariaLabel('Remove')
		        .ok('Remove')
		        .cancel('Cancel');

		    $mdDialog.show(confirm).then(function() {
		      	var idx = $scope.tasks.indexOf(data);
				$scope.tasks.splice(idx, 1);
		    }, function() {
		      	return;
		    });

		}

		var pushItem = function(data){
			angular.forEach(data, function(item, idx){
				var nextLoop = true;
				// compare current item with other items on the array
				angular.forEach(data, function(other, key){
					if(nextLoop && idx != key)
					{
						if(item.file_name == other.file_name){
							item.duplicate = true;
							nextLoop = false;
						}
					}
				})

				item.delivery_date = new Date(item.delivery_date);
				item.live_date = new Date(item.live_date);
				$scope.tasks.push(item);

				var filter = {};

				filter.display = item.file_name;

				$scope.toolbar.items.push(filter);
			});
		}

		$scope.excelUploader.onCompleteItem  = function(data, response){			
			Spreadsheet.read(response.id)
				.success(function(data){
					$scope.tasks = [];

					if(Array.isArray(data[0]))
					{
						angular.forEach(data, function(sheet){
							angular.forEach(sheet, function(item){
								item.spreadsheet_id = response.id;
								$scope.tasks.push(item);
							})
						});
					}
					else {
						angular.forEach(data, function(item){
							item.spreadsheet_id = response.id;
							$scope.tasks.push(item);
						})
					}
					
					Task.checkDuplicateMultiple($scope.tasks)
						.success(function(data){
							pushItem(data);
							$scope.tasks = data;
							$scope.show = true;
						})
						.error(function(){
							Preloader.error();
						})

					$scope.fab.show = true;
				})
				.error(function(){
					Preloader.error();
				})
		}

		var busy = false;
		var duplicate = false;	

		$scope.fab.action = function(){
			if($scope.form.taskForm.$invalid){
				angular.forEach($scope.form.taskForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			angular.forEach($scope.tasks, function(item){
				if(item.duplicate){
					Preloader.alert('Duplicate File Name', item.file_name +' already exists.');
					duplicate = true;
				}
				else{
					item.delivery_date = item.delivery_date.toDateString();
					item.live_date = item.live_date.toDateString();
				}
			});

			if(!busy && !duplicate){
				busy = true;
				Preloader.preload();

				Task.storeMultiple($scope.tasks)
					.success(function(data){
						busy = false;
						
						if(data){
							angular.forEach($scope.tasks, function(item){
								item.delivery_date = new Date(item.delivery_date);
								item.live_date = new Date(item.live_date);
							});

							return;
						}

						Preloader.stop();
						$scope.toolbar.back();
					})
					.error(function(){
						Preloader.error()
					});
			}
		};
	}]);
sharedModule
	.factory('Category', ['$http', function($http){
		var urlBase = '/category';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			checkDuplicate: function(data){
				return $http.post(urlBase + '-check-duplicate', data);
			},
		}
	}]);
sharedModule
	.factory('Client', ['$http', function($http){
		var urlBase = '/client';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('Comment', ['$http', function($http){
		var urlBase = '/comment';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('DesignerAssigned', ['$http', function($http){
		var urlBase = '/designer-assigned';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			paginate: function(data, page)
			{
				return $http.post(urlBase + '-paginate?page=' + page, data);
			},
		}
	}]);
sharedModule
	.factory('Notification', ['$http', function($http){
		var urlBase = '/notification';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			markAsRead: function(id){
				return $http.get(urlBase + '-mark-as-read/' + id);
			},
			markAllAsRead: function(){
				return $http.get(urlBase + '-mark-all-as-read');
			},
		}
	}]);
sharedModule
	.factory('QualityControlAssigned', ['$http', function($http){
		var urlBase = '/quality-control-assigned';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('QualityControlTask', ['$http', function($http){
		var urlBase = '/quality-control-task';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('Rework', ['$http', function($http){
		var urlBase = '/rework';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}]);
sharedModule
	.factory('Spreadsheet', ['$http', function($http){
		var urlBase = '/spreadsheet';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			read: function(id){
				return $http.get(urlBase + '-read/' + id);
			},
			paginate: function(request, page){
				return $http.post(urlBase + '-paginate?page=' + page, request);
			},
		}
	}]);
sharedModule
	.factory('Task', ['$http', function($http){
		var urlBase = '/task';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			paginate: function(data, page){
				if(!page)
				{
					return $http.post(urlBase + '-paginate', data);
				}
				
				return $http.post(urlBase + '-paginate?page=' + page, data);
			},
			storeMultiple: function(data){
				return $http.post(urlBase + '-store-multiple', data);
			},
			checkDuplicateMultiple: function(data){
				return $http.post(urlBase + '-check-duplicate-multiple', data);
			},
			enlist: function(data){
				return $http.post(urlBase + '-enlist', data);
			},
			started: function(data){
				return $http.post(urlBase + '-started', data);
			}
		}
	}]);
sharedModule
	.factory('User', ['$http', function($http){
		var urlBase = '/user';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' +id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},

			/* checks authenticated user */
			check: function(query){
				return $http.post(urlBase + '-check', query);
			},
			/* logout authenticated user */
			logout: function(){
				return $http.post(urlBase + '-logout');
			},
			/* checks if email is in use */
			checkEmail: function(data){
				return $http.post(urlBase + '-check-email', data);
			},
			/* checks old password is the same with new password */
			checkPassword: function(data){
				return $http.post(urlBase + '-check-password', data);
			},
			/* changes password of authenticated user */
			changePassword: function(data){
				return $http.post(urlBase + '-change-password', data);
			},
			/* resets passwords of specific user */
			resetPassword: function(data){
				return $http.post(urlBase + '-reset-password', data);
			},
			paginate: function(page){
				return $http.get(urlBase + '-paginate?page=' + page);
			},
			disable: function(data){
				return $http.post(urlBase + '-disable', data);
			},
			markAsRead: function(id){
				return $http.get(urlBase + '-mark-as-read/' + id);
			},
			enlist: function(data){
				return $http.post(urlBase + '-enlist', data);
			},
		}
	}]);
sharedModule
	.service('Preloader', ['$mdDialog', '$mdToast', '$http', function($mdDialog, $mdToast, $http){
		var dataHolder = null;

		return {
			confirm: function(data)
			{
				var confirm = $mdDialog.confirm()
			        .title(data.title)
			        .textContent(data.message)
			        .ariaLabel(data.title)
			        .ok(data.ok)
			        .cancel(data.cancel);

			    return $mdDialog.show(confirm);
			},
			alert: function(title, message){
				$mdDialog.show(
					$mdDialog.alert()
				        .parent(angular.element($('body')))
				        .clickOutsideToClose(true)
				        .title(title)
				        .textContent(message)
				        .ariaLabel(title)
				        .ok('Got it!')
				    );
			},
			newNotification: function(message, action) {
				var toast = $mdToast.simple()
			      	.textContent(message)
			      	.action(action)
			      	.highlightAction(true)
			      	.highlightClass('md-primary')// Accent is used by default, this just demonstrates the usage.
			      	.position('bottom right');

			    var audio = new Audio('/audio/notif.mp3')
			    audio.play();
			    
			    return $mdToast.show(toast);
			},
			/* Notifies a user with a message */
			notify: function(message){
				return $mdToast.show(
			    	$mdToast.simple()
				        .textContent(message)
				        .position('bottom right')
				        .hideDelay(3000)
			    );
			},
			/* Starts the preloader */
			preload: function(){
				return $mdDialog.show({
					templateUrl: '/app/shared/templates/loading.html',
				    parent: angular.element(document.body),
				});
			},
			/* Stops the preloader */
			stop: function(data){
				return $mdDialog.hide(data);
			},
			/* Shows error message if AJAX failed */
			error: function(){
				return $mdDialog.show(
			    	$mdDialog.alert()
				        .parent(angular.element($('body')))
				        .clickOutsideToClose(true)
				        .title('Oops! Something went wrong!')
				        .content('An error occured. Please contact administrator for assistance.')
				        .ariaLabel('Error Message')
				        .ok('Got it!')
				);
			},
			/* Send temporary data for retrival */
			set: function(data){
				dataHolder = data;
			},
			/* Retrieves data */
			get: function(){
				return dataHolder;
			},
			checkDuplicate: function(urlBase, data){
				return $http.post(urlBase + '-check-duplicate', data);
			},
		};
	}]);
sharedModule
	.service('Setting', ['$http', '$mdToast', function($http, $mdToast){
		return {
			paginate: function(type, page){
				var urlBase = type == 'Categories' ? 'category' : (type == 'Clients' ? 'client' : (type == 'Designers' ? 'user-designers' : 'user-quality_control'));

				return $http.get(urlBase + '-paginate?page=' + page);
			},
			search: function(type, data){
				var urlBase = type == 'Categories' ? 'category-enlist' : (type == 'Clients' ? 'client-enlist' : 'user-enlist');

				return $http.post(urlBase, data);
			},
			settingController: function(action, type){
				// removes white spaces
				type = type.replace(/\s/g, '');
				return action + type + 'DialogController';
			},
			settingDialogTemplate: function(action, type){
				if(type == 'Designers' || type == 'Quality Control'){
					return action + '-users-dialog.template.html';
				}

				// replaces white spaces with dashes and lower cases all captial letters
				type = type.replace(/\s+/g, '-').toLowerCase();

				return action + '-' + type + '-dialog.template.html';
			},
			fabCreateSuccessMessage: function(type){
				if(type == 'Categories'){
					var message = 'A new category has been added.'
				}
				else if(type == 'Clients'){
					var message = 'A new client has been added.'
				}
				else if(type == 'Designers'){
					var message = 'A new designer has been added to your team.'
				}
				else if(type == 'Quality Control'){
					var message = 'A new quality control has been added to your team.'
				}

				return $mdToast.show(
			    	$mdToast.simple()
				        .textContent(message)
				        .position('bottom right')
				        .hideDelay(3000)
			    );
			},
			delete: function(type, item){
				var urlBase = type == 'Categories' ? 'category' : 'client';

				return $http.delete(urlBase + '/' + item.id);
			}
		}
	}]);
sharedModule
	.controller('customNotificationToastController', ['$scope', '$mdToast', '$state', 'Preloader', 'Notification', function($scope, $mdToast, $state, Preloader, Notification){
		$scope.notification = Preloader.get();

		console.log($scope.notification);

		$scope.notification.first_letter = $scope.notification.sender.name.charAt(0).toUpperCase();
		$scope.notification.sender = $scope.notification.sender.name;
		$scope.notification.created_at = new Date($scope.notification.data.created_at);
	}]);
//# sourceMappingURL=shared.js.map
