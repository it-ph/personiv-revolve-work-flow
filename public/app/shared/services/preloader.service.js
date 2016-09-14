sharedModule
	.service('Preloader', ['$mdDialog', '$mdToast', '$http', function($mdDialog, $mdToast, $http){
		var dataHolder = null;

		return {
			customNotification: function(data){
				dataHolder = data;
				$mdToast.show({
		          	hideDelay   : 3000,
		          	position    : 'bottom right',
		          	controller  : 'customNotificationToastController',
		          	templateUrl : '/app/shared/templates/toasts/custom-notification-toast.template.html'
		        });
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