sharedModule
	.controller('sharedNotificationsContentContainerController', ['$scope', '$filter', '$state', 'Preloader', 'Notification', 'User', function($scope, $filter, $state, Preloader, Notification, User){
		$scope.$on('refresh', function(){
			$scope.init();
		});

		$scope.toolbar = {};

		$scope.toolbar.childState = 'Notifications';

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
			$scope.notification.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.notification.busy = false;
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
		};

		var pushItem = function(notif){
			notif.data = JSON.parse(notif.data);
			notif.first_letter = notif.data.sender.name.charAt(0).toUpperCase();
			notif.sender = notif.data.sender.name;
			notif.created_at = new Date(notif.created_at);

			if(notif.type == 'App\\Notifications\\TaskCreated'){
				notif.message = 'created a new task.';
				notif.task_id = notif.data.attachment.task_id;
			}
			else if(notif.type == 'App\\Notifications\\SpreadsheetCreated'){
				notif.message = 'created a new sheet.';
				notif.task_id = notif.data.attachment.id
			}

			else if(notif.type == 'App\\Notifications\\TaskAssignedToDesigner'){
				notif.message = 'assigned a task for ' + notif.data.attachment.designer.name + '.';
				notif.task_id = notif.data.attachment.task_id;
			}

			else if(notif.type == 'App\\Notifications\\DesignerTaskStart'){
				notif.message = 'started to work on ' + notif.data.attachment.task.file_name + '.';
				notif.task_id = notif.data.attachment.task_id;
			}

			else if(notif.type == 'App\\Notifications\\TaskDeleted'){
				notif.message = 'deleted a task.';
				notif.task_id = notif.data.attachment.task_id;
			}

			else if(notif.type == 'App\\Notifications\\DesignerTaskDecline'){
				notif.message = 'declined to work on ' + notif.data.attachment.task.file_name + '.';
				notif.task_id = notif.data.attachment.task_id;
			}

			else if(notif.type == 'App\\Notifications\\ForQC'){
				notif.message = 'submitted a task for quality control.';
				notif.task_id = notif.data.attachment.id;
			}

			else if(notif.type == 'App\\Notifications\\QualityControlTaskStart'){
				notif.message = 'started to work on ' + notif.data.attachment.task.file_name + '.';
				notif.task_id = notif.data.attachment.task_id;
			}

			else if(notif.type == 'App\\Notifications\\MarkAsComplete'){
				notif.message = 'marked ' + notif.data.attachment.file_name + ' as complete.';
				notif.task_id = notif.data.attachment.id;
			}

			else if(notif.type == 'App\\Notifications\\TaskRework'){
				notif.message = 'marked ' + notif.data.attachment.file_name + ' as rework.';
				notif.task_id = notif.data.attachment.id;
			}

			else if(notif.type == 'App\\Notifications\\NotifyComment'){
				notif.message = 'commented on a task on ' + notif.data.attachment.file_name + '.';
				notif.task_id = notif.data.attachment.id;
			}

			else if(notif.type == 'App\\Notifications\\DesignerRevisionStart'){
				notif.message = 'started to revise ' + notif.data.attachment.task.file_name + '.';
				notif.task_id = notif.data.attachment.task_id;
			}

			/* Designers */
			else if(notif.type == 'App\\Notifications\\NotifyDesignerForNewTask'){
				notif.message = 'assigned a task for you.';
				notif.task_id = notif.data.attachment.task_id;
			}

			else if(notif.type == 'App\\Notifications\\NotifyDesignerForCompleteTask'){
				notif.message = 'marked your task ' + notif.data.attachment.file_name + ' as complete.';
				notif.task_id = notif.data.attachment.id;
			}

			else if(notif.type == 'App\\Notifications\\NotifyComment'){
				notif.message = 'commented on your task on ' + notif.data.attachment.file_name + '.';
				notif.task_id = notif.data.attachment.id;
			}

			else if(notif.type == 'App\\Notifications\\NotifyDesignerForTaskRework'){
				notif.message = 'marked your task ' + notif.data.attachment.file_name + ' as rework.';
				notif.task_id = notif.data.attachment.id;
			}

			var item = {
				'display': notif.sender,
				'message': notif.message,
				'file_name': notif.data.attachment.file_name ? notif.data.attachment.file_name : null,
			}

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(){
			var request = {
				'paginate': 20,
			}

			$scope.notification = {};
			$scope.notification.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.notification.page = 2;

			Notification.paginate(request)
				.success(function(data){
					if(!data)
					{
						$scope.notification.show = true;
						return;
					}
					
					$scope.notification.details = data;
					$scope.notification.items = data.data;
					$scope.notification.show = true;

					// Hides inactive records
					$scope.showInactive = false;

					if(data.data.length){
						// iterate over each record and set the updated_at date and first letter
						angular.forEach(data.data, function(item){
							pushItem(item);
						});

					}

					$scope.notification.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.notification.busy || ($scope.notification.page > $scope.notification.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.notification.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Notification.paginate(request, $scope.notification.page)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.notification.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.notification.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.notification.busy = false;
								$scope.isLoading = false;
							});
					}
				})
		};

		$scope.init();
	}]);