(function() {
	angular.module('wedding')
	.directive('nav', Nav);

	function Nav() {
		return {
			restrict: 'E', 
			link: function() {

			},
			templateUrl: 'components/common/navbar.html'
		};
	};
})();

