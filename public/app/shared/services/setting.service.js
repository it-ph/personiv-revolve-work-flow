sharedModule
	.service('Setting', ['$http', function($http){
		return {
			paginate: function(type, page){
				var urlBase = type == 'Categories' ? 'category' : (type == 'Clients' ? 'client' : 'user-designers');

				return $http.get(urlBase + '-paginate?page=' + page);
			},
		}
	}]);