(function() {
	angular.module('home.controller', [])
	.controller('homeController', HomeController);

	HomeController.$inject = ['$state'];
	function HomeController($state) {
		var vm = this;
	};

})();