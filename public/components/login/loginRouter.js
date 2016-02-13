(function() {
	angular.module('wedding')
	.config(LoginRouter);

	LoginRouter.$inject = ['$stateProvider'];
	function LoginRouter($stateProvider) {
		$stateProvider
	    .state('login', {
	      url: '/login',
	      templateUrl: 'components/login/login.html',
	      controller: 'loginController',
	      controllerAs: 'loginCtrl'
    	});
	}
})();