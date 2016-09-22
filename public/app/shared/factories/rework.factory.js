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
			revise: function(data){
				return $http.post(urlBase + '/revise', data);
			},
			forQC: function(data){
				return $http.post(urlBase + '/for-qc', data);
			},
			startQC: function(data){
				return $http.post(urlBase + '/start-qc', data);
			},
			complete: function(data){
				return $http.post(urlBase + '/complete', data);
			},
			pass: function(data){
				return $http.post(urlBase + '/pass', data);
			},
			rework: function(data){
				return $http.post(urlBase + '/rework', data);
			},
		}
	}]);