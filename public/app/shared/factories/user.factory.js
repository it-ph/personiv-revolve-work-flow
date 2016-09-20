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
			check: function(query){
				return $http.post(urlBase + '/check', query);
			},
			/* logout authenticated user */
			logout: function(){
				return $http.post(urlBase + '/logout');
			},
			/* checks if email is in use */
			checkEmail: function(data){
				return $http.post(urlBase + '/check-email', data);
			},
			/* checks old password is the same with new password */
			checkPassword: function(data){
				return $http.post(urlBase + '/check-password', data);
			},
			/* changes password of authenticated user */
			changePassword: function(data){
				return $http.post(urlBase + '/change-password', data);
			},
			/* resets passwords of specific user */
			resetPassword: function(data){
				return $http.post(urlBase + '/reset-password', data);
			},
			paginate: function(page){
				return $http.get(urlBase + '/paginate?page=' + page);
			},
			disable: function(data){
				return $http.post(urlBase + '/disable', data);
			},
			markAsRead: function(id){
				return $http.get(urlBase + '/mark-as-read/' + id);
			},
			enlist: function(data){
				return $http.post(urlBase + '/enlist', data);
			},
		}
	}]);