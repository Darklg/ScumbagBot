
var ScumbagBot = new Class({
	initialize : function(){
		this.answers = ['Et alors ?','Et sinon ?','aha',':3','ok'];
		this.conversationPoints = {sayHello:false};
		this.question = '';
		this.answer = '';
		this.tmpanswer = '';
		this.logconversation = [];
		this.setEvents();
	},
	setElements : function(){
		var mthis = this, opt = this.opt;
	},
	setEvents : function(){
		var mthis = this, opt = this.opt;
		$('formlove').addEvent('submit',function(e){
			new Event(e).stop();
			mthis.question = $('la_question').get('value');
			if(mthis.question != ''){
				mthis.askquestion();
				mthis.botanswer();
			}
		});
	},
	askquestion : function () {
		$('la_question').set('value','');
		
		// Clean question
		this.question = this.question;
		
		this.setLog('You',this.question);
	},
	analyseQuestion : function(){
		var tmpquestion = this.trim((this.question + '').toLowerCase());
		
		// Bonjour
		if(this.questionStart(tmpquestion,['bjr','slt','salut','hello','coucou','bonjour'])){
			if(this.conversationPoints.sayHello != true){
				this.conversationPoints.sayHello = true;
				this.tmpanswer = this.arrand(['Hello','Bonjour']);
			}
			else {
				this.tmpanswer = this.arrand(['Tu m\'as déjà dit bonjour.','On va passer la journée à se dire bonjour, ou ... ?']);
			}
			return 0;
		}
		
		// Excuses
		if(this.questionStart(tmpquestion,['pardon','dsl'])){
			this.tmpanswer = this.arrand(['Je préfère ça.','Ouais ouais ...','...']);
			return 0;
		}
		

	},
	questionStart : function(tmpquestion,tab){
		var retour = false;
		for(var i= 0; i < tab.length; i++){
			if(tmpquestion.substr(0,tab[i].length) == tab[i]){
				retour = true;
			}
		}
		return retour;
	},
	setBotAnswer : function(){
		
		var convlngth = this.logconversation.length;
		
		// Si on a une réponse temporaire, on l'affiche
		if(this.tmpanswer != ''){
			this.answer = this.tmpanswer;
			this.tmpanswer = '';
			return 0;
		}

		// Si quelqu'un ne dit pas bonjour assez vite
		if(convlngth > 1 && this.conversationPoints.sayHello != true){
			this.answer = 'Tu dis pas bonjour ?';
			return 0;
		}
		
		if(convlngth < 2) {
			this.answer = '';
			return 0;
		}
		
		// Sinon, réponse aléatoire
		this.answer = this.arrand(this.answers);
		
	},
	botanswer : function(){
		var mthis = this, opt = this.opt;
		var delay = (Math.floor(Math.random()*7)+1)*100;
		
		this.analyseQuestion();
		this.setBotAnswer();
		
		if(mthis.answer != ''){
			(function(){
				mthis.setLog('Bot',mthis.answer);
			}).delay(delay);
		}
	},
	setLog : function(who,what){
		this.logconversation.push([who,what]);
		$('log').set('html',
			$('log').get('html') + '<li><strong>' + who + '</strong> : <span class="question">' + what + '</span></li>'
		);
	},
	// Utilities
	trim : function(text) {
		return text.replace(/^\s+|\s+$/g,"");
	},
	arrand : function(larray) {
		return larray[Math.floor(Math.random()*larray.length)];
	}
});
new ScumbagBot();
