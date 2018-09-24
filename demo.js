if (Meteor.isClient) {
    
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

    Template.hello.events(
	{
		'click button#confirmLabel': function () {
			// update our Labels document
		    Meteor.call('confirmLabel');
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

}

if (Meteor.isServer) {

    Meteor.startup(function () {
	Batches.upsert({name: "main"}, {name: "main", active: true});
	var batch = TurkServer.Batch.getBatchByName("main");
	batch.setAssigner(new TurkServer.Assigners.SimpleAssigner);
	// batch.setAssigner(new TurkServer.Assigners.TestAssigner);
    });

    TurkServer.initialize(function() { // the start of an experiment
	var clickObj = {count: 0};
	Clicks.insert(clickObj);
	// intialize for label
	var labelObj = {label: 'nothing'};
	Labels.insert(labelObj);
    });

    Meteor.publish('clicks', function() {
	return Clicks.find();
    });

    Meteor.publish('labels', function() {
	return Labels.find();
    });

    Meteor.methods({
	goToExitSurvey: function() {
	    TurkServer.Instance.currentInstance().teardown();
	},
	incClicks: function() {
	    Clicks.update({}, {$inc: {count: 1}});
	    var asst = TurkServer.Assignment.currentAssignment();
	    asst.addPayment(0.1);
	},
	// confirm button
	confirmLabel: function() {
		Labels.update({}, {$set: {label: 'something'}});
	}
    });

}
