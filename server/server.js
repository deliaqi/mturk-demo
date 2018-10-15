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
	// Timer.upsert({user: Meteor.userId(), currentTimer: 0}); 
	Meteor.call('updateTimer', 0);
});

TurkServer.initialize (function () {
	var start = new Date();
    var end = new Date(start.getTime() + 600000);
    TurkServer.Timers.startNewRound(start, end);
});

TurkServer.Timers.onRoundEnd(function(reason) {
    if (reason === TurkServer.Timers.ROUND_END_TIMEOUT) {
    	var currentRound = RoundTimers.findOne({}, { sort: { index: -1 } });
    	if (currentRound.index < 3) {
	    	var start = new Date();
	    	var end = new Date(start.getTime() + 600000);
			TurkServer.Timers.startNewRound(start, end); 
			Meteor.call('updateTimer', 0);
    	} else {
    		Meteor.call('goToExitSurvey');
    		Meteor.call('updateTimer', 0);
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

Meteor.publish('timer', function() {
	return Timer.find();
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
		Questions.upsert({num: 1, setNum: 1}, {$set: {question: "如果可以跟世上任何人共进晚餐, 你会选择谁?"}});
		Questions.upsert({num: 2, setNum: 1}, {$set: {question: "你会想出名吗? 以什么样方式出名呢?"}});
		Questions.upsert({num: 3, setNum: 1}, {$set: {question: "在打一通电话之前, 你会先排演要在电话中说什么吗? 为什么?"}});
		Questions.upsert({num: 4, setNum: 1}, {$set: {question: "你心中最完美的一天是做哪些事呢?"}});
		Questions.upsert({num: 5, setNum: 1}, {$set: {question: "你上一次唱歌给自己听是什么时候? 上一次唱给别人听又是何时?"}});
		Questions.upsert({num: 6, setNum: 1}, {$set: {question: "如果你可以活到90岁, 并能在30岁过后让体态或大脑一直保持30岁的状态到死, 你会选保持体态还是大脑呢?"}});
		Questions.upsert({num: 7, setNum: 1}, {$set: {question: "你有曾经预感过自己会怎么死亡吗?"}});
		Questions.upsert({num: 8, setNum: 1}, {$set: {question: "举出3个你与你对面这位的共同点."}});
		Questions.upsert({num: 9, setNum: 1}, {$set: {question: "你人生中你最感激什么?"}});
		Questions.upsert({num: 10, setNum: 1}, {$set: {question: "如果你能改变你是怎么被抚育成人的, 你会想改变什么?"}});
		Questions.upsert({num: 11, setNum: 1}, {$set: {question: "用四分钟跟你对面这位分享你的一生, 越详细越好."}});
		Questions.upsert({num: 12, setNum: 1}, {$set: {question: "如果你明早一觉醒来发现自己获得了某种能力, 你希望是什么能力?"}});
		Questions.upsert({num: 13, setNum: 2}, {$set: {question: "如果一颗魔法水晶球能告诉你有关你自己, 你的人生, 你的未来, 或任何事情, 你会想知道什么?"}});
		Questions.upsert({num: 14, setNum: 2}, {$set: {question: "你有已经梦想了很久, 想做的事情吗? 你为什么还没去做?"}});
		Questions.upsert({num: 15, setNum: 2}, {$set: {question: "你人生中最大的成就是什么?"}});
		Questions.upsert({num: 16, setNum: 2}, {$set: {question: "一段友情中你最珍视的是什么?"}});
		Questions.upsert({num: 17, setNum: 2}, {$set: {question: "你最珍贵的一段回忆是什么?"}});
		Questions.upsert({num: 18, setNum: 2}, {$set: {question: "你最糟糕的一段回忆是什么?"}});
		Questions.upsert({num: 19, setNum: 2}, {$set: {question: "如果你知道你会在一年后突然死去, 你会想改变任何你现在的生活方式吗? 为什么?"}});
		Questions.upsert({num: 20, setNum: 2}, {$set: {question: "友情对你来说代表什么?"}});
		Questions.upsert({num: 21, setNum: 2}, {$set: {question: "爱与喜欢在你的人生中有着什么样的地位?"}});
		Questions.upsert({num: 22, setNum: 2}, {$set: {question: "轮流分享你觉得你的恋人应该具有的五项好品质?"}});
		Questions.upsert({num: 23, setNum: 2}, {$set: {question: "你的家庭亲密温暖吗? 你觉得你的童年有比别人幸福点吗?"}});
		Questions.upsert({num: 24, setNum: 2}, {$set: {question: "你觉得你跟你的母亲的关系怎么样呢?"}});
		Questions.upsert({num: 25, setNum: 3}, {$set: {question: "用‘我们’做主语造三个肯定句, 比如：我们都在这个房间里."}});
		Questions.upsert({num: 26, setNum: 3}, {$set: {question: "完成以下句子‘我希望我有一个人能与ta分享...‘"}});
		Questions.upsert({num: 27, setNum: 3}, {$set: {question: "如果你会跟你对面的人变成亲密好友, 分享一下你觉得对方必需得知道的事情."}});
		Questions.upsert({num: 28, setNum: 3}, {$set: {question: "告诉你对面的人你喜欢ta什么: 老实回答, 说一些你通常不会告诉刚认识的人的答案."}});
		Questions.upsert({num: 29, setNum: 3}, {$set: {question: "与你对面的人分享人生中很尴尬的一刻."}});
		Questions.upsert({num: 30, setNum: 3}, {$set: {question: "你上一次在别人面前哭是什么时候? 上一次自己哭是什么时候?"}});
		Questions.upsert({num: 31, setNum: 3}, {$set: {question: "告诉你对面的人你已经喜欢上ta的什么?"}});
		Questions.upsert({num: 32, setNum: 3}, {$set: {question: "有什么人事物是太严重, 不能随便开玩笑的?"}});
		Questions.upsert({num: 33, setNum: 3}, {$set: {question: "如果你将在今晚死去, 没有任何再与他人交流的机会, 你最后悔没有把什么事情跟别人说?"}});
		Questions.upsert({num: 34, setNum: 3}, {$set: {question: "你的家着火了, 里面有你所拥有的一切事物. 在救出你爱的人, 你的宠物后, 你还有时间最后再冲回去一趟拯救最后一样任何东西, 你会救出什么? 为什么?"}});
		Questions.upsert({num: 35, setNum: 3}, {$set: {question: "你家庭中的所有人里, 谁的死会让你最难受? 为什么?"}});
		Questions.upsert({num: 36, setNum: 3}, {$set: {question: "分享一个你私人的问题, 并想你对面的人询问ta会怎么处理. 之后再请ta回答, 对于你选这个问题, ta有什么看法?"}});
	},
	updateTimer: function(curtime) {
		Timer.upsert({user: Meteor.userId()}, {$set: {currentTimer: curtime}});
	},
})