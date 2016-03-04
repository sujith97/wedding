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
        var id = store.get('id'),
          token = store.get('token');;
        if (id) {
          config.headers['id'] = id;
          config.headers['token'] = token;
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
        var id = store.get('id');
        if (newState.data && newState.data.requiresLogin && !id) {
          console.log('Home');
          $state.go('home');
          event.preventDefault();
        }
      }
    }

})();