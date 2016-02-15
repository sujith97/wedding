(function() {
	angular.module('wedding')
	.directive('nav', Nav)
	.directive('socialNav', socialNav);

	function socialNav() {

		SocialNavCtrl.$inject = ['$scope', '$location', 'facebookService', 'store'];
		function SocialNavCtrl($scope, $location, facebookService, store) {
			$scope.hasNotLoggedIn = true;
			angular.element('.profile').on('mouseover', function() {$scope.$apply(function() {$scope.name = 'SignOut'})});
			angular.element('.profile').on('mouseleave', function() {$scope.$apply(function() {$scope.name = store.get('name')})});

			$scope.isActive = function(viewLocation) {
				return viewLocation === $location.path();
			};
			var name = store.get('name');
			if (name) {
				$scope.hasNotLoggedIn = false;
				$scope.name = name;
			}
			$scope.signOut = function() {
				facebookService.logout().then(function(response) {
					$scope.hasNotLoggedIn = true;
					$scope.name = '';
					store.set('id', undefined);
					store.set('name', undefined);
				});
			}

			$scope.fbLogin = function() {
				facebookService.getName().then(function(response) {
					
					$scope.name = response.name;
					store.set('id', response.id);
					store.set('name', response.name);
					setTimeout(function() { $scope.hasNotLoggedIn = false; }, 1);
				},
				function(response) {
				 console.log(response);
				}
				);
			};
		}

		return {
			restrict: 'E',
			controller: SocialNavCtrl,
			link: function() {
				$('.ui.floating.dropdown').dropdown();
			},
			templateUrl: 'components/common/socialSignIn.html'
		};
	}

	function Nav() {
		return {
			restrict: 'E', 
			link: function() {
			},
			templateUrl: 'components/common/navbar.html'
		};
	};

	window.fbAsyncInit = function() {
	  FB.init({ 
	    appId: '143638359331079',
	    status: true, 
	    cookie: true, 
	    xfbml: true,
	    version: 'v2.4'
	  });
	};
})();

