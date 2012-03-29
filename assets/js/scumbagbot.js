
var ScumbagBot = new Class({
	initialize : function(){
		this.answers = ['Et alors ?','Et sinon ?','aha',':3','ok'];
		this.conversationPoints = {
			sayHello:false,
			askForNews:false
		};
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
		var tmpquestion = this.AccentToNoAccent(this.trim((this.question + '').toLowerCase()));
		
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
		
		// Nouvelles
		if(this.questionStart(tmpquestion,['ca va','sava','ca boume'])){
			if(this.conversationPoints.askForNews != true){
				this.conversationPoints.askForNews = true;
				this.tmpanswer = this.arrand(['Oui.','Ouais, ça va.']);
			}
			else {
				this.tmpanswer = this.arrand(['OUI, CA VA.','Oui, mais si tu continues à me demander si ça va, ça ne va pas durer.']);
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
	
	
	/* ----------------------------------------------------------
		Utilities
	   ------------------------------------------------------- */
	
	trim : function(text) {
		return text.replace(/^\s+|\s+$/g,"");
	},
	arrand : function(larray) {
		return larray[Math.floor(Math.random()*larray.length)];
	},

	/* ----------------------------------------------------------
		Clean string
		http://www.deep-know.com/2007/11/22/comment-supprimer-les-accents-en-javascript/
	   ------------------------------------------------------- */
	
	// Remplace toutes les occurences d'une chaine
	replaceAll : function(str, search, repl) {
		while (str.indexOf(search) != -1)
		str = str.replace(search, repl);
		return str;
	},

	// Remplace les caractères accentués
	AccentToNoAccent : function(str) {
		var norm = new Array('À','Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
		'Ì','Í','Î','Ï', 'Ð','Ñ','Ò','Ó','Ô','Õ','Ö','Ø','Ù','Ú','Û','Ü','Ý',
		'Þ','ß', 'à','á','â','ã','ä','å','æ','ç','è','é','ê','ë','ì','í','î',
		'ï','ð','ñ', 'ò','ó','ô','õ','ö','ø','ù','ú','û','ü','ý','ý','þ','ÿ');
		var spec = new Array('A','A','A','A','A','A','A','C','E','E','E','E',
		'I','I','I','I', 'D','N','O','O','O','0','O','O','U','U','U','U','Y',
		'b','s', 'a','a','a','a','a','a','a','c','e','e','e','e','i','i','i',
		'i','d','n', 'o','o','o','o','o','o','u','u','u','u','y','y','b','y');
		for (var i = 0; i < spec.length; i++){
			str = this.replaceAll(str, norm[i], spec[i]);
		}
		return str;
	}
});
new ScumbagBot();
