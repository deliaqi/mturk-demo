

var myInterval = Meteor.setInterval(function(){
	  // var timer = Timer.findOne({user:Meteor.userId()});
	  var curtimer = Session.get("curTimer");
      curtimer ++;
      Session.set("curTimer", curtimer);
      // var progress = parseInt(100 * curtimer / ( 60 * 15 ));
      console.log("Interval called " + curtimer + " times" + "width: "+ progress +"%");
   }, 1000);

Tracker.autorun(function() {
	if (TurkServer.inExperiment()) {
	    Router.go('/experiment');
	} else if (TurkServer.inExitSurvey()) {
	    Router.go('/survey');
	} else if (TurkServer.inLobby()) {
		Router.go('/lobby');
	}
 });

Tracker.autorun(function() { //every time the value of this variable changes
	var group = TurkServer.group(); //returns the id of the experiment that a user is currently in
	if (group == null) return;	// If the value is not null, then the user is indeed in an experiment
	Meteor.subscribe('clicks', group); // triggers the publication code on the server
    // add subscribtion for Label document
    Meteor.subscribe('labels', group);

    Meteor.subscribe('answers', group);

    Meteor.subscribe('questions', group);

    Meteor.subscribe('timer', group);
});

Template.hello.created = function () {
	var curtimer = Timer.findOne({user:Meteor.userId()},{currentTimer : 1});
	if( curtimer && curtimer > 0) {
		Session.set("curTimer", curtimer);
	} else {
		Session.set("curTimer", 0);
	}
	Session.set("questionNum", 1);
	Meteor.call('getUsersCount', function (error, result) {
		if (error) {
			console.log(error);
		} else {
			Session.set("peopleCount", result)
		}
	});
}

Template.hello.helpers(
{
	counter: function () {
		// get our Click document, we only have access to our own click document
	    var clickObj = Clicks.findOne();
	    // if it exists, return the count field
	    return clickObj && clickObj.count;
		},
	email: function () {
		var labelObj = Labels.findOne();
		return labelObj && labelObj.label;
	},
	people: function () {
 		return Session.get("peopleCount") || "Loading";
	},
	roundNum: function () {
		var currentRound = RoundTimers.findOne({}, { sort: { index: -1 } });
		var roundNum = currentRound.index;
		Session.set("questionNum", roundNum);
		return roundNum;
	},
	onequestion: function () {
		var roundNum = Session.get("questionNum");
		var question = Questions.findOne({num: roundNum});
		return question && question.question;
	},
	questions: function () {
		var roundNum = Session.get("questionNum");
		var questions = Questions.find({setNum: roundNum});
		return questions;
	},
	getAnswer: function (number) {
		// var roundNum = Session.get("questionNum");
		// console.log(roundNum)
		var answer = Answers.findOne({user:Meteor.userId(), no: number.toString()});
		return answer && answer.answer;
	},
	anotherAnswer: function (number) {
		// var roundNum = Session.get("questionNum");
		var answer = Answers.findOne({user: {$ne: Meteor.userId()}, no: number.toString()});
		return answer && answer.answer;
	},
	currentTimer: function (number) {
		var curtimer = Session.get("curTimer");
		Meteor.call('updateTimer', curtimer);
		// var timer = Timer.findOne({user:Meteor.userId()});
		// return timer && timer.currentTimer;
		var m = parseInt(curtimer / 60);
        var s = parseInt(curtimer % 60);
		return m + "分" + s + "秒";
	},
	progress: function () {
		var progress = 0;
		progress = Session.get("curTimer");
		return parseInt(100 * progress / ( 1000 * 60 * 15 ));
	},
});


Template.hello.events(
{
	'click button#clickMe': function () {
		// update our Clicks document
	    Meteor.call('incClicks');
	},
	// 'click button#confirmLabel': function (e) {
	// 	// update our Labels document
	// 	var text = event.target.text.value;
	//     Meteor.call('confirmLabel');
	// }
	'submit .mark': function (e) {
	    e.preventDefault();
	    // update our Labels document
		var piclabel = e.target.picLabel.value;
		// Labels.update({}, {$set: {label: piclabel}});
		Meteor.call('updateLabel',piclabel);
	},
	'click button#exitSurvey': function () {
	    Meteor.call('goToExitSurvey');
	},
	'keydown input': function (e) {
		if (e.keyCode == 13) {
			var id = e.target.id;
			var answer = document.getElementById(id).value;

			Meteor.call('saveAnswer', id, answer);
		}
	}
});

Template.survey.events({
	'submit .survey': function (e) {
	    e.preventDefault();
	    var results = {confusing: e.target.confusing.value,
			   feedback: e.target.feedback.value};
	    TurkServer.submitExitSurvey(results);
	}
});