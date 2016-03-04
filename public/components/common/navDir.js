(function() {
	angular.module('wedding')
	.directive('nav', Nav)
	.directive('socialNav', socialNav);

	function socialNav() {
		SocialNavCtrl.$inject = ['$scope', 'store', 'socket', '$window', '$cookies'];
		function SocialNavCtrl($scope, store, socket, $window, $cookies) {
			if ($scope.ID) {
				store.set('id', $scope.ID);
				store.set('token', $scope.TOKEN);
				socket.emit('name', {id: $scope.ID, token: $scope.TOKEN});
			}
			socket.on('person_name', function(name) {
				$scope.name = name;
			});

			socket.emit('fb_url');
			socket.on('fb_url_resp', function(fbUrl) {
				$scope.fbUrl = fbUrl;
	  	});

			socket.on('logged out', function() {
				$cookies.remove('ramana');
				$cookies.remove('gokula');
				$window.location = '/';
			})

			$scope.fbLogin = function() {
				$window.location = $scope.fbUrl;
			}

			$scope.signOut = function() {
				store.remove('id');
				store.remove('token');
				socket.emit('logout', {id: $scope.ID, token: $scope.TOKEN});
			}
		}

		return {
			restrict: 'E',
			controller: SocialNavCtrl,
			link: function() {
			},
			templateUrl: 'components/common/socialSignIn.html'
		};
	}

	function Nav() {
		return {
			restrict: 'E', 
			link: function() {
			},
			controller: ['$scope', '$location', function($scope, $location) {
				$scope.isActive = function(viewLocation) {
					return viewLocation === $location.path();
				};
				if ($scope.USER) {
					console.log($scope.USER);
				}
			}],
			templateUrl: 'components/common/navbar.html'
		};
	};

})();

