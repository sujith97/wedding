(function() {
	angular.module('wedding')
	.config(MessagesRouter);

	MessagesRouter.$inject = ['$stateProvider'];
	function MessagesRouter($stateProvider) {
		$stateProvider
	    .state('messages', {
	      url: '/messages',
	      templateUrl: 'components/messages/messages.html',
	      controller: 'messagesController',
	      controllerAs: 'msgCtrl',
	      data: { requiresLogin: true }
    	});
	}
})();