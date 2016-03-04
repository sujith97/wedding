var WdUser = require('../models/UserSchema'),
	Content = require('../models/ContentSchema'),
	q = require('q');

var service = {
	findUser: findUser,
	updateUserSession: updateUserSession,
	getEventsContent: getEventsContent
}

function getEventsContent(eventId) {
	var defer = q.defer();
	Content.findById(eventId, function (err, content) {
		if (err) { 
			console.error(err);
			defer.reject(err);
		} else {
			defer.resolve(content); 
		}
	});
	return defer.promise;
}

function findUser(userId) {
	var defer = q.defer();
	WdUser.findById(userId.toString(), function (err, person) {
		if (err) { 
			console.error(err);
			defer.reject(err);
		} else {
			defer.resolve(person); 
		}
	});
	return defer.promise;
}

function updateUserSession(conditions, options, update) {
	var defer = q.defer();
	WdUser.where(conditions).setOptions(options).update({ $set: update }, function(data) {
		defer.resolve(data);
	});
	return defer.promise;
}

function saveNewUser(wd_user) {
	var defer = q.defer();
	var loggedInUser = new WdUser(wd_user);
	loggedInUser.save(function(err, response) {
		if (err) { 
			console.error(err);
			defer.reject(err);
		} else {
			defer.resolve(response);
		}
	});
}

function updateUser() {

	
}

module.exports = service;