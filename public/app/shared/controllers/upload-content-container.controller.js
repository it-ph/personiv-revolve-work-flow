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
					if(data.file_name == task.file_name){
						duplicate = true;
						nextLoop = false;
					}
				}
			});

			if(duplicate){
				return;
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