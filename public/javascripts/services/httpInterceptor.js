(function() {
    angular.module('seed')
    .factory('authInterceptor', SessionInterseptor)
    .config(HttpConfig);

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

})();