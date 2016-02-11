(function() {
	var CONSTANTS = {};

	angular.module('seed', ['ui.router', 'angular-storage', 'login.controller', 'home.controller'])
	.constant('CONSTANTS', CONSTANTS)
	.config(ConfigureRouting)
	.run(ConfigureAuthentication)

	ConfigureRouting.$inject = ['$stateProvider', '$urlRouterProvider'];
	function ConfigureRouting($stateProvider, $urlRouterProvider) {
		$stateProvider
	    .state('login', {
	      url: '/login',
	      templateUrl: 'templates/login.html',
	      controller: 'loginController',
	      controllerAs: 'loginCtrl'
	    })
	    .state('home', {
	      url: '/home',
	      templateUrl: 'templates/home.html',
	      controller: 'homeController',
	      controllerAs: 'homeCtrl',
	      data: { requiresLogin: true }
	    });
	  $urlRouterProvider.otherwise('/login');
	}

	ConfigureAuthentication.$inject = ['$rootScope', 'store', '$state'];
	function ConfigureAuthentication($rootScope, store, $state) {
		$rootScope.$on('$stateChangeStart', handleRouteChange);
		function handleRouteChange(event, newState) {
			var token = store.get('token');
			if (newState.data && newState.data.requiresLogin && !token) {
				console.log('Login');
				$state.go('login');
				event.preventDefault();
			}
		}
	}
	
})();