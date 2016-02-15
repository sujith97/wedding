(function() {
	angular.module('messages.controller', [])
	.controller('messagesController', MessagesController);

	MessagesController.$inject = ['$state'];
	function MessagesController($state) {
		var vm = this;
	};

})();