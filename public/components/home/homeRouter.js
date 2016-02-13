(function() {
	angular.module('wedding')
	.config(HomeRouter);

	HomeRouter.$inject = ['$urlRouterProvider', '$stateProvider'];
	function HomeRouter($urlRouterProvider, $stateProvider) {
		$stateProvider
	    .state('home', {
	      url: '/home',
	      templateUrl: 'components/home/home.html',
	      controller: 'homeController',
	      controllerAs: 'homeCtrl',
	      data: { requiresLogin: false }
    });
	}
})();