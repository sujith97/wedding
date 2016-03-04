var Content = require('../models/ContentSchema');
var service = {
	saveVenue: saveVenue
}

function saveVenue() {
	console.info('Removing all elements from Contents...');
	Content.remove({}, function(err, data) {

	});

	var venue = [];
	venue.push(dummyWeddingData());
	venue.push(dummyReceptionData());
	venue.push(dummyBridalData());

	var content = new Content({_id: 1, "venue": venue, "eventId": process.env.FB_EVENT_ID});
	content.save(function(err, data) {
		console.log(err + '\n' + data);
	})
}

module.exports = service;

function dummyWeddingData() {
	var weddingVenue = {
		"_type": "wedding",
        "visibility": "WEDDING",
        "name": "VMR Convention",
        "time": "9AM",
        "street": "Near Injapur, Nagarjun Sagar Road",
        "city": "Hyderabad",
        "state": "Telangana",
        "country": "India",
        "content": "Request your presence at the ceremony and celebration of their marriage."
	}
	return weddingVenue;
}

function dummyReceptionData() {
	var receptionVenue = {
		"_type": "reception",
        "visibility": "RECEPTION",
        "name": "Shilparamam Rock Garden",
        "time": "6PM",
        "street": "Hi-Tech City Main Road, Madhapur, Near Cyber Towers",
        "city": "Hyderabad",
        "state": "Telangana",
        "country": "India",
        "content": "Request the pleasure of your company at the celebration of their reception ceremony."
	}
	return receptionVenue;
}

function dummyBridalData() {
	var showerVenue = {
		"_type": "bridal",
        "visibility": "BRIDAL",
        "name": "At their home",
        "time": "10AM",
        "street": "Jubilee Hills and Karmanghat",
        "city": "Hyderabad",
        "state": "Telangana",
        "country": "India",
        "content": "Pleasure to welcome you to take part in my bridal shower ceremony."
	}
	return showerVenue;
}