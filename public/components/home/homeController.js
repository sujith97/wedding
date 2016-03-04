(function() {
	angular.module('home.controller', [])
	.controller('homeController', HomeController);

	HomeController.$inject = ['$scope', '$state', 'socket'];
	function HomeController($scope, $state, socket) {
		var vm = this;
		var deadline = '2016-03-10';
		initializeClock($scope, vm, deadline);
		socket.emit('event details', {id: $scope.ID, token: $scope.TOKEN});

		socket.on('event details resp', function(events) {
			console.log(events.wedding)
			vm.events = events;
		});
	};

	function initializeClock($scope, vm, endtime){
		vm.days = 12;
	  var timeinterval = setInterval(function() {
	    var t = getTimeRemaining(endtime);
	    $scope.$apply(function() {
	    	vm.days = t.days;
	    	vm.hours = t.hours;
	    	vm.minutes = t.minutes;
	    	vm.seconds = t.seconds;
	    });
	    if(t.total<=0){
	      clearInterval(timeinterval);
	    }
	  },1000);
	}

	function getTimeRemaining(endtime){
	  var t = Date.parse(endtime) - Date.parse(new Date());
	  var seconds = Math.floor( (t/1000) % 60 );
	  var minutes = Math.floor( (t/1000/60) % 60 );
	  var hours = Math.floor( (t/(1000*60*60)) % 24 );
	  var days = Math.floor( t/(1000*60*60*24) );
	  return {
	    'total': t,
	    'days': days,
	    'hours': hours,
	    'minutes': minutes,
	    'seconds': seconds
	  };
	}
})();