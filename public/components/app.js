(function() {
	var CONSTANTS = {};

	angular.module('wedding', ['ui.router', 'angular-storage', 'login.controller', 'home.controller'])
	.constant('CONSTANTS', CONSTANTS)
	.config(ConfigureRouting);

	ConfigureRouting.$inject = ['$urlRouterProvider', '$stateProvider'];
	function ConfigureRouting($urlRouterProvider, $stateProvider) {
	  $urlRouterProvider.otherwise('/home');
	}
	
})();