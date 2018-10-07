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
    });

    Template.hello.helpers({
		counter: function () {
			// get our Click document, we only have access to our own click document
		    var clickObj = Clicks.findOne();
		    // // if it exists, return the count field
		    return clickObj && clickObj.count;
	}
    });

    Template.hello.helpers(
	{
		answer: function () {
			var labelObj = Labels.findOne();
			return labelObj && labelObj.label;
		}
    });

    Template.hello.events(
    {
		'click button#clickMe': function () {
			// update our Clicks document
		    Meteor.call('incClicks');
	}
    });

    Template.hello.events({
	// 	'click button#confirmLabel': function (e) {
	// 		// update our Labels document
	// 		var text = event.target.text.value;
	// 	    Meteor.call('confirmLabel');
	// }
		'submit .mark': function (e) {
		    e.preventDefault();
		    // update our Labels document
			var piclabel = e.target.picLabel.value;
			// Labels.update({}, {$set: {label: piclabel}});
			Meteor.call('updateLabel',piclabel);
		}
    });



    Template.hello.events({
		'click button#exitSurvey': function () {
		    Meteor.call('goToExitSurvey');
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