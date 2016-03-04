(function() {

	angular.module('wedding')
		.factory('facebookService', FacebookService);

	FacebookService.$inject = ['$q'];
	function FacebookService($q) {
		var service = {
			getName: getName,
			getPicture: getPicture,
			isInvited: isInvited,
			logout: Facebook().logout
		}
		return service;

		function getName() {
			return Facebook().api('/me', {});
		}

		function getPicture() {
			return Facebook().api('/me/picture', {});
		}

		function isInvited(id) {
			var deferred = $q.defer();
			var groupId = '/193236234370730';
			Facebook().api(groupId + '/noreply/' + id, {}).then(function(noreply) {
				if (noreply.data.length > 0) {
					deferred.resolve(true); 
				} else {
					Facebook().api(groupId + '/maybe/' + id, {}).then(function(maybe) {
						if (maybe.data.length > 0) {
							deferred.resolve(true); 
						} else {
							Facebook().api(groupId + '/attending/' + id, {}).then(function(attending) {
								if (attending.data.length > 0) {
									deferred.resolve(true); 
								} else {
									Facebook().api(groupId + '/interested/' + id, {}).then(function(interested) {
										if (interested.data.length > 0) {
											deferred.resolve(true); 
										} else {
											deferred.resolve(false); 
										}
									});
								}
							});
						}
					});
				}
			});
			return deferred.promise;
		}

		function Facebook() {
			return {
				api: function(path, params) {
					var deferred = $q.defer();
					this.checkLoginState().then(function(response) {
						FB.api(path, params, function(response) {
				      if (!response || response.error) {
				        deferred.reject(response);
				      } else {
				        deferred.resolve(response);
				      }
				    });
					}, function(response) {
						deferred.reject(response);
					});
					return deferred.promise;
				},
				login: function() {
					var deferred = $q.defer();
					FB.login(function(response) {
						if (response.authResponse) {
							deferred.resolve(response);
						} else {
							// User cancelled login or did not fully authorize
							deferred.reject(response);
						}
					}, {scope: 'user_about_me'});
					return deferred.promise;
				},
				logout: function() {
					var deferred = $q.defer();
					FB.logout(function(response) {
					  deferred.resolve(response);
					});
					return deferred.promise;
				},
				checkLoginState: function() {
					var deferred = $q.defer(),
							that = this;
			    FB.getLoginStatus(function(response) {
				    if (response.status === 'connected') {
				      deferred.resolve(response);
				    } else if (response.status === 'not_authorized') {
				    	deferred.reject(response);
				    } else {
				      that.login().then(function(response) {
				      	deferred.resolve(response);
				      }, function(response) {
				      	deferred.reject(response);
				      })
				    }
			    });
			    return deferred.promise;
				}
			}
		}
	}
})();