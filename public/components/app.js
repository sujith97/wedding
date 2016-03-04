(function() {
	var CONSTANTS = {};

	angular.module('wedding', ['ngCookies', 'ui.router', 'btford.socket-io', 'angular-storage', 'home.controller', 'messages.controller'])
	.constant('CONSTANTS', CONSTANTS)
	.config(ConfigureRouting)
	.factory('socket', InstantiateSocketIo);

	ConfigureRouting.$inject = ['$urlRouterProvider', '$stateProvider'];
	function ConfigureRouting($urlRouterProvider, $stateProvider) {
	  $urlRouterProvider.otherwise('/home');
	}
	
	InstantiateSocketIo.$inject = ['socketFactory'];
	function InstantiateSocketIo(socketFactory) {
		return socketFactory();
	}

})();