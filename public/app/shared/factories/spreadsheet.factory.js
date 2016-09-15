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
		}
	}]);