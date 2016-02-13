(function() {
	angular.module('login.controller', [])
	.controller('loginController', LoginController);

	LoginController.$inject = ['$state'];
	function LoginController($state) {
		var vm = this;
	};

})();