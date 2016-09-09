var adminModule = angular.module('admin', ['sharedModule']);
adminModule
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'content-container@main': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'dashboardContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/components/admin/templates/sidenavs/main-left-sidenav.template.html',
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
						templateUrl: '/app/components/admin/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.settings': {
						templateUrl: '/app/components/admin/templates/subheaders/settings-subheader.template.html',
					},
					'content@main.settings':{
						templateUrl: '/app/components/admin/templates/content/settings-content.template.html',
					},
				}
			})
	}]);
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
adminModule
	.controller('mainViewController', ['$scope', '$mdDialog', '$mdSidenav', '$mdToast', 'User', 'Preloader', function($scope, $mdDialog, $mdSidenav, $mdToast, User, Preloader){
		$scope.toggleSidenav = function(menuID){
			$mdSidenav(menuID).toggle();
		}

		$scope.menu = {};

		$scope.menu.static = [
			{
				'state': 'main',
				'icon': 'mdi-view-dashboard',
				'label': 'Dashboard',
			},
			{
				'state': 'main.tasks',
				'icon': 'mdi-view-list',
				'label': 'Tracker',
			},
			{
				'state': 'main.notifications',
				'icon': 'mdi-bell',
				'label': 'Notifications',
			},
			{
				'state': 'main.settings',
				'icon': 'mdi-settings',
				'label': 'Settings',
			},
		]
		

		$scope.logout = function(){
			User.logout()
				.success(function(){
					window.location.href = '/';
				});
		}

		$scope.changePassword = function()
		{
			$mdDialog.show({
		      controller: 'changePasswordDialogController',
		      templateUrl: '/app/shared/templates/dialogs/change-password-dialog.template.html',
		      parent: angular.element(document.body),
		      fullscreen: true,
		    })
		    .then(function(){
		    	$mdToast.show(
		    		$mdToast.simple()
				        .content('Password changed.')
				        .position('bottom right')
				        .hideDelay(3000)
		    	);
		    });
		}

		User.check()
			.success(function(data){
				$scope.user = data;
			})
	}]);
adminModule
	.controller('settingsContentContainerController', ['$scope', '$filter', '$mdDialog', '$mdToast', '$mdBottomSheet', '$mdMedia', 'Preloader', 'Setting', 'User', function($scope, $filter, $mdDialog, $mdToast, $mdBottomSheet, $mdMedia, Preloader, Setting, User){
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
			$scope.showInactive = false;
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
		
		/* Sets up the page for what tab it is*/
		var setInit = function(item){
			var fabController = Setting.fabController(item);
			var fabDialogTemplate = Setting.fabDialogTemplate(item);

			$scope.fab.label = item;

			/* Create */
			$scope.fab.action = function(){
				$mdDialog.show({
			      	controller: fabController,
			      	templateUrl: '/app/components/admin/templates/dialogs/' + fabDialogTemplate,
			      	parent: angular.element(document.body),
			      	fullscreen: true,
			    })
			    .then(function() {
				    /* Refreshes the list*/
				    Setting.fabCreateSuccessMessage(item)
				    	.then(function(){
						    $scope.init($scope.subheader.currentNavItem, true);
				    	})
			    }, function() {
			    	return;
			    });
			}

			$scope.init(item);
			$scope.toolbar.items = [];
			if(item != 'Designers'){
				$scope.item_menu = [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						action: function(){

						}, 
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						action: function(){

						}, 
					},
				];
			}
			else{
				$scope.item_menu = [
					{
						'label': 'Update Info',
						'icon': 'mdi-pencil',
						action: function(user){
							Preloader.set(user);
							$mdDialog.show({
						      	controller: 'editDesignersDialogController',
						      	templateUrl: '/app/components/admin/templates/dialogs/edit-designers-dialog.template.html',
						      	parent: angular.element(document.body),
						      	fullscreen: true,
						    })
						    .then(function(user) {
							    /* Refreshes the list*/
							    $mdToast.show( 
									$mdToast.simple()
								        .textContent(user.name + '\'s account has been updated.')
								        .position('bottom right')
								        .hideDelay(3000)
							    )
						    	.then(function(){
								    $scope.init($scope.subheader.currentNavItem, true);
						    	})
						    }, function() {
						    	return;
						    });
						}, 
					},
					{
						'label': 'Reset Password',
						'icon': 'mdi-key-minus',
						action: function(user){
							var confirm = $mdDialog.confirm()
					        	.title('Reset password')
					          	.textContent('Reset ' + user.name + '\'s password?')
					          	.ariaLabel('Reset password')
					          	.ok('Reset')
					          	.cancel('Cancel');

					        $mdDialog.show(confirm).then(function() {
						      	/* Resets the password to !welcome10 */
						      	User.resetPassword([user])
						      		.success(function(){
						      			var message = user.name + '\'s password has been reset to "!welcome10".'
						      			Preloader.notify(message);
						      		})
						      		.error(function(){
						      			Preloader.error();
						      		});
						    }, function() {
						      	return;
						    });
						}, 
					},
					{
						'label': 'Disable Account',
						'icon': 'mdi-account-remove',
						action: function(user){
							var confirm = $mdDialog.confirm()
					        	.title('Disable account')
					          	.textContent('Disable ' + user.name + '\'s account?')
					          	.ariaLabel('Disable account')
					          	.ok('Disable')
					          	.cancel('Cancel');

					        $mdDialog.show(confirm).then(function() {
						      	/* Disables account of the user */
						      	User.disable([user])
						      		.success(function(){
						      			$scope.type.busy = true;
						      			$scope.type.show = false;
						      			var message = user.name + '\'s account has been disabled.'
						      			Preloader.notify(message)
							      			.then(function(){	
								      			$scope.init($scope.subheader.currentNavItem, true)
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
			{
				'label':'Designers',
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

		$scope.init = function(request, refresh){
			$scope.type = {};
			$scope.type.items = [];

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

					if(refresh){
						Preloader.notify('Refreshed')
					}

					$scope.type.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.type.busy || ($scope.type.page > $scope.type.details.last_page)){
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.type.busy = true;
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
							});
					}
				})
		};

		$scope.subheader.currentNavItem = $scope.subheader.navs[0].label;

		$scope.fab.label = $scope.subheader.navs[0].label;
		
		/* Sets up the page for what tab it is*/
		setInit($scope.subheader.currentNavItem);

	}]);
adminModule
	.controller('itemActionsBottomSheetController', ['$scope', '$mdBottomSheet', 'Preloader', function($scope, $mdBottomSheet, Preloader){
		$scope.type = Preloader.get();

		$scope.action = function(idx){
			$mdBottomSheet.hide(idx);
		}
	}]);
adminModule
	.controller('createDesignersDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', function($scope, $mdDialog, Preloader, User){
		$scope.user = {};
		$scope.user.role = 'Designer';

		$scope.busy = false;
		$scope.duplicate = false;
		$scope.showHints = true;

		$scope.checkDuplicate = function(){
			User.checkEmail($scope.user)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			$scope.showHints = false;
			if($scope.userForm.$invalid){
				angular.forEach($scope.userForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if($scope.user.password != $scope.user.confirm)
			{
				return;
			}
			
			$scope.busy = true;
			User.store($scope.user)
				.success(function(duplicate){
					if(duplicate){
						$scope.busy = false;
						return;
					}

					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		}
	}]);
adminModule
	.controller('editDesignersDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', function($scope, $mdDialog, Preloader, User){
		$scope.user = Preloader.get();
		$scope.label = Preloader.get().name;

		$scope.busy = false;
		$scope.duplicate = false;
		$scope.showHints = true;

		$scope.checkDuplicate = function(){
			User.checkEmail($scope.user)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			$scope.showHints = false;
			if($scope.userForm.$invalid){
				angular.forEach($scope.userForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if($scope.user.password != $scope.user.confirm)
			{
				return;
			}

			$scope.busy = true;
			User.update($scope.user.id, $scope.user)
				.success(function(data){
					if(typeof data == 'boolean'){
						$scope.busy = false;
						return;
					}

					Preloader.stop(data);
				})
				.error(function(){
					Preloader.error();
				});
		}
	}]);
adminModule
	.controller('itemActionsDialogController', ['$scope', '$mdDialog', 'Preloader', function($scope, $mdDialog, Preloader){
		$scope.type = Preloader.get();

		$scope.action = function(idx){
			$mdDialog.hide(idx);
		}
	}]);
//# sourceMappingURL=admin.js.map
