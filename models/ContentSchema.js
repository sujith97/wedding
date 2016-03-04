// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('CONTENT', new Schema({
    "_id": Number,
    "venue": [{
        "_type": String,
        "visibility": String,
        "name": String,
        "time": String,
        "street": String,
        "city": String,
        "state": String,
        "country": String,
        "content": String
    }],
    "eventId": Number
}));

var visibility = {
    "BRIDAL": "Only bridal shower event is visible",
    "WEDDING": "Wedding event is visible",
    "RECEPTION": "Reception event is visible"
}