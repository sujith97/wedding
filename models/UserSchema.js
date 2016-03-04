// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('WDNG_USER', new Schema({
	_id: String,
    name: String,
    picUrl: String,
    hasWeddingInvitation: Boolean,
    hasReceptionInvitation: Boolean,
    hasBridalInvitation: Boolean,
    superUser: Boolean,
    authToken: String,
    ttl: Number
}));