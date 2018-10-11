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

	var inst = TurkServer.Instance.currentInstance();
	var users = inst.users();
	Answers.upsert({user: users[0], no: 1}, {$set: {answer: ""}});
	Answers.upsert({user: users[1], no: 1}, {$set: {answer: ""}});

	Meteor.call('initQuestion');
});

TurkServer.initialize (function () {
	var start = new Date();
    var end = new Date(start.getTime() + 60000);
    TurkServer.Timers.startNewRound(start, end);
});

TurkServer.Timers.onRoundEnd(function(reason) {
    if (reason === TurkServer.Timers.ROUND_END_TIMEOUT) {
    	var currentRound = RoundTimers.findOne({}, { sort: { index: -1 } });
    	if (currentRound.index < 5) {
	    	var start = new Date();
	    	var end = new Date(start.getTime() + 60000);
			TurkServer.Timers.startNewRound(start, end);    		
    	} else {
    		Meteor.call('goToExitSurvey');
    	}
    }
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
Meteor.publish('questions', function() {
	return Questions.find();
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
		var inst = TurkServer.Instance.currentInstance();
		return inst.users().length;
	},
	saveAnswer: function(number, realAnswer) {
		Answers.upsert({user: Meteor.userId(), no: number}, {$set: {answer: realAnswer}});
	},
	initQuestion: function() {
		Questions.upsert({num: 1}, {$set: {question: "如果可以跟世上任何人共进晚餐, 你会选择谁?"}});
		Questions.upsert({num: 2}, {$set: {question: "你会想出名吗? 以什么样方式出名呢?"}});
		Questions.upsert({num: 3}, {$set: {question: "在打一通电话之前, 你会先排演要在电话中说什么吗? 为什么?"}});
		Questions.upsert({num: 4}, {$set: {question: "你心中最完美的一天是做哪些事呢?"}});
		Questions.upsert({num: 5}, {$set: {question: "你上一次唱歌给自己听是什么时候? 上一次唱给别人听又是何时?"}});
	}
})