var sharedModule = angular.module('sharedModule', [
	'ui.router',
	'ngMaterial',
	'ngMessages',
	'infinite-scroll',
	'chart.js',
	'angularMoment'
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
			check: function(){
				return $http.get(urlBase + '-check');
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
			}
		}
	}]);
sharedModule
	.service('Preloader', ['$mdDialog', '$mdToast', '$http', function($mdDialog, $mdToast, $http){
		var dataHolder = null;

		return {
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
//# sourceMappingURL=shared.js.map
