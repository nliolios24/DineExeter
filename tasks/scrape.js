var mongoose = require('mongoose'),
	cheerio = require('cheerio'),
	request = require('request'),

	tools = require('../tools'),

	Food = mongoose.model('Food');

mongoose.connect('mongodb://nliolios24:Flyingjunior14@candidate.33.mongolayer.com:10557,candidate.21.mongolayer.com:10610/app33336951');

exports.update = function() {
	parseHTML(function(foods){
		foods.forEach(function(food) {
			if (food == null) return;

			delete food._id;
			food.weekyear = tools.getWeekYear(new Date())

			Food.update(food, food, { upsert: true}, function(err){
				if (err) console.log(err)
			})
    	})
    })
}

function parseHTML(callback){
	var url = 'http://exeter.edu/student_life/14202_15947.aspx';
	request({ uri: url }, function (error, response, body) {  
  		if (error || response.statusCode !== 200) {
    		console.log('Error when contacting exeter.edu' + error)
  		}

  		foods = parseMealData(body)
  		callback(foods);
	})

}

function parseMealData(body){
	$ = cheerio.load(body)

	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	var meals = ['Breakfast', 'Lunch', 'Dinner']
	var dhall = ['Wetherell', 'Elm Street', '']

	var d = new Date();
	var temp = []
	var foods = [];

	var currentDhall = 'Elm Street';

	days.forEach(function(day) {
		meals.forEach(function(meal) {
			$('#lbl' + meal + day + ' p').each(function() {
				var text = $(this).text().trim()
				if(dhall.indexOf(text) == 0 || dhall.indexOf(text) == 1) {
					currentDhall = dhall[dhall.indexOf(text)]
				} else if (text) {
					foods.push(
						{ name: text, mealday: meal + day, iselm: dhall.indexOf(currentDhall) }
					);
				}
			});
		})
	})
	return foods;

}