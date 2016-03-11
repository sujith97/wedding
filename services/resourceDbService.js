var Liquor = require('../models/LiquorSchema'),
	Steward = require('../models/StewardSchema'),
	Dispatch = require('../models/BottleDispatchSchema'),
	q = require('q');

var service = {
	saveLiquor: saveLiquor,
	saveSteward: saveSteward,
	findLiquor: findLiquor,
	findSteward: findSteward,
	associate: associate,
	findAllAssociations: findAllAssociations
}

function findAllAssociations() {
	var defer = q.defer();
	Steward.find({}, function(err, stewards) {
		defer.resolve(stewards);
	});
	
	return defer.promise;
}

function associate(associations) {

	var defer = q.defer();
	Liquor.where({ _id: associations.liquor }).setOptions({ upsert: false }).update({ $set: {steward_id: associations.steward} }
		, function(data) {

		findSteward(associations.steward).then(function(stewardDb) {
			stewardDb.bottles.push(associations.liquor);
			stewardDb.dispatchedTime.push(new Date());
			Steward.where({ _id: associations.liquor }).setOptions({ upsert: false }).update({ $set: stewardDb }
				, function(data) {
				defer.resolve(data);
			});
		});

	});
	return defer.promise;
}

function findSteward(code) {
	var defer = q.defer();
	Steward.findById(code, function (err, found) {
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(found);
		}
	});
	return defer.promise;
}

function findLiquor(code) {
	var defer = q.defer();
	Liquor.findById(code, function (err, found) {
		console.log(found);
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(found);
		}
	});
	return defer.promise;
}

function saveLiquor(bottle) {
	bottle.dispatchedTime = new Date();
	var defer = q.defer(),
		newBottle = new Liquor(bottle);
	newBottle.save(function(err, response) {
		if (err) { 
			console.error(err);
			defer.reject(err);
		} else {
			defer.resolve(response);
		}
	});
	return defer.promise;
}

function saveSteward(steward) {
	var defer = q.defer(),
		steward = new Steward(steward);
	steward.save(function(err, response) {
		if (err) { 
			console.error(err);
			defer.reject(err);
		} else {
			defer.resolve(response);
		}
	});
	return defer.promise;
}

module.exports = service;