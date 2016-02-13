(function() {
    angular.module('wedding')
    .factory('authInterceptor', SessionInterseptor)
    .config(HttpConfig)
    .run(ConfigureAuthentication);

    SessionInterseptor.$inject = ['store'];
    function SessionInterseptor(store) {
      var service = {
          request: handleRequest
      };
      return service;

      function handleRequest(config) {
        var token = store.get('token');
        if (token) {
            config.headers['session-token'] = token;
        } else {
          config.headers['session-token'] = 'NONE';
        }
        return config;
      }
    }

    HttpConfig.$inject = ['$httpProvider'];
    function HttpConfig($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
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