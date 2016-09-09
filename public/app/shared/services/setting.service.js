sharedModule
	.service('Setting', ['$http', '$mdToast', function($http, $mdToast){
		return {
			paginate: function(type, page){
				var urlBase = type == 'Categories' ? 'category' : (type == 'Clients' ? 'client' : 'user-designers');

				return $http.get(urlBase + '-paginate?page=' + page);
			},
			fabController: function(type){
				return 'create' + type + 'DialogController';
			},
			fabDialogTemplate: function(type){
				type = type.charAt(0).toLowerCase() + type.slice(1);

				return 'create-' + type + '-dialog.template.html';
			},
			fabCreateSuccessMessage: function(type){
				if(type == 'Categories'){
					var message = 'A new category has be added.'
				}
				else if(type == 'Clients'){
					var message = 'A new client has be added.'
				}
				else if(type == 'Designers'){
					var message = 'A new designer has be added to your team.'
				}

				return $mdToast.show(
			    	$mdToast.simple()
				        .textContent(message)
				        .position('bottom right')
				        .hideDelay(3000)
			    );
			},
		}
	}]);