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
				return $http.post(urlBase + '/paginate?page=' + page, data);
			},
			start: function(data){
				return $http.post(urlBase + '/start', data);
			},
			decline: function(data){
				return $http.post(urlBase + '/decline', data);
			},
			forQC: function(data){
				return $http.post(urlBase + '/for-qc', data);
			},
		}
	}]);