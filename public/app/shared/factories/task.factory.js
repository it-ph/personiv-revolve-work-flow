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
					return $http.post(urlBase + '/paginate', data);
				}
				
				return $http.post(urlBase + '/paginate?page=' + page, data);
			},
			storeMultiple: function(data){
				return $http.post(urlBase + '/store-multiple', data);
			},
			checkDuplicateMultiple: function(data){
				return $http.post(urlBase + '/check-duplicate-multiple', data);
			},
			enlist: function(data, page){
				if(!page)
				{
					return $http.post(urlBase + '/enlist', data);
				}
				
				return $http.post(urlBase + '/enlist?page=' + page, data);
			},
		}
	}]);