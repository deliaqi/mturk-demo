Meteor.startup(function () {
	Batches.upsert({name: "main"}, {name: "main", active: true});
	var batch = TurkServer.Batch.getBatchByName("main");
	// batch.setAssigner(new TurkServer.Assigners.SimpleAssigner);
	const assigner = new TurkServer.Assigners.PairAssigner;
	batch.setAssigner(assigner);
});

TurkServer.initialize(function() { // the start of an experiment
	var clickObj = {count: 0};
	Clicks.insert(clickObj);
	// intialize for label
	var labelObj = {label: 'Your email address'};
	Labels.insert(labelObj);
});



Meteor.publish('clicks', function() {
	return Clicks.find();
});

Meteor.publish('labels', function() {
	return Labels.find();
});

Meteor.publish('answers', function() {
	return Answers.find();
});


Meteor.methods({
	goToExitSurvey: function() {
	    TurkServer.Instance.currentInstance().teardown();
	},
	incClicks: function() {
	    Clicks.update({}, {$inc: {count: 1}});
	    var asst = TurkServer.Assignment.currentAssignment();
	    asst.addPayment(0.1);
	    // return 0.1;
	},
	// confirm button
	updateLabel: function(piclabel) {
		// var piclabel = e.target.picLabel.value;
		Labels.update({}, {$set: {label: piclabel}});
	},

	// get users
	getUsersCount: function() {
		var userlist = TurkServer.Instance.currentInstance().users();
		return userlist.length;
	},
	saveAnswer: function(number, realAnswer) {
		Answers.upsert({user: Meteor.userId(), no: number}, {$set: {answer: realAnswer}});
	},
})