// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('STEWARD', new Schema({
	_id: String,
    firstName: String,
    lastName: String,
    bottles: [String],
    dispatchedTime: [Date]
}));