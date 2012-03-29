
var ScumbagBot = new Class({
	initialize : function(){
		this.phrases = {
			_default : ['Et alors ?','Et sinon ?','aha',':3','ok','That\'s what she said'],
			_hello : {
				q : ['hey','yo','bjr','slt','salut','hello','coucou','bonjour'],
				r : ['Hello','Bonjour','Salutations'],
				r2 : ['Tu m\'as déjà dit bonjour.','On va passer la journée à se dire bonjour, ou ... ?']
			},
			_news : {
				yn : {
					q : ['ca va','cava','sava','ca boume'],
					r : ['Oui.','Ouais, ça va.'],
					r2 : ['OUI, CA VA.','Oui, mais si tu continues à me demander si ça va, ça ne va pas durer.']
				},
				how : {
					q : ['comment ca va','comment va tu','comment vas-tu','comment vas tu'],
					r : ['ca va.'],
					r2 : ['J\'ai dit que ça allait.','ca va, j\'ai dit']
				}
			},
			_remarks : {
				_hello : ['Tu dis jamais bonjour ?'],
				_news : ['Tu demandes pas de mes nouvelles ?','Et moi, on s\'en fout ?','...'],
			},
			_simplestart : {
				_apologies : {
					q : ['pardon','dsl'],
					r : ['Je préfère ça.','Ouais ouais ...']
				},
				_whatnews : {
					q : ['quoi de neuf','quoidneuf'],
					r : ['que du vieux']
				},
				_beliefs : {
					q : ['crois tu','crois-tu','est-ce que tu crois'],
					r : ['non','je ne crois pas, je suis un bot.']
				}
			}
		};
		this.conversationPoints = {
			sayHello:false,
			askForNews:false
		};
		this.question = '';
		this.answer = '';
		this.logconversation = [];
		this.setEvents();
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
	setconversationPoint : function(ConvPoints){
		if(typeof ConvPoints == 'string'){
			ConvPoints = new Array(ConvPoints);
		}
		for(var Point in ConvPoints){
			if(typeof ConvPoints[Point] == 'string'){
				eval('this.conversationPoints.'+ConvPoints[Point]+'=true;');
			}
		}		
	},
	setBotAnswer : function(){
		var tmpquestion = this.AccentToNoAccent(this.trim((this.question + '').toLowerCase()));
		var convlngth = this.logconversation.length;
		
		this.setconversationPoint('azaz');
		this.setconversationPoint(['azaz','azaz']);

		// Bonjour
		if(this.questionStart(tmpquestion,this.phrases._hello.q)){
			if(this.conversationPoints.sayHello != true){
				this.setconversationPoint('sayHello');
				this.answer = this.arrand(this.phrases._hello.r);
			}
			else {
				this.answer = this.arrand(this.phrases._hello.r2);
			}
			return 0;
		}
		
		
		// Nouvelles
		for(var phr_name in this.phrases._news){
			var q = eval('this.phrases._news.'+phr_name).q;
			var r = eval('this.phrases._news.'+phr_name).r;
			var r2 = eval('this.phrases._news.'+phr_name).r2;
			
			if(this.questionStart(tmpquestion,q)){
				if(this.conversationPoints.askForNews != true){
					this.setconversationPoint(['sayHello','askForNews']);
					this.answer = this.arrand(r);
				}
				else {
					this.answer = this.arrand(r2);
				}
				return 0;
			}
		}

		// Si quelqu'un ne dit pas bonjour assez vite
		if(convlngth > 1 && this.conversationPoints.sayHello != true){
			this.answer = this.arrand(this.phrases._remarks._hello);
			return 0;
		}
		
		// Si quelqu'un ne demande pas des nouvelles
		if(convlngth > 1 && this.conversationPoints.askForNews != true && this.conversationPoints.sayHello == true){
			this.answer = this.arrand(this.phrases._remarks._news);
			return 0;
		}
		
		// Echanges simples
		for(var phr_name in this.phrases._simplestart){
			var q = eval('this.phrases._simplestart.'+phr_name).q;
			var r = eval('this.phrases._simplestart.'+phr_name).r;
			if(this.questionStart(tmpquestion,q)){
				this.answer = this.arrand(r);
				return 0;
			}
		}
		
		if(convlngth < 2) {
			this.answer = '';
			return 0;
		}
		
		// Sinon, réponse aléatoire
		this.answer = this.arrand(this.phrases._default);
		
	},
	botanswer : function(){
		var mthis = this, opt = this.opt;
		var delay = (Math.floor(Math.random()*7)+1)*100;
		
		this.setBotAnswer();
		
		if(mthis.answer != ''){
			(function(){
				mthis.setLog('Bot',mthis.answer);
			}).delay(delay);
		}
	},
	setLog : function(who,what){
		
		var clength = this.logconversation.length;
		
		// Envoi de la conversation
		this.logconversation.push([who,what]);
		$('log').set('html',
			$('log').get('html') + '<li id="conv-' + clength + '"><strong>' + who + '</strong> : <span class="question">' + what + '</span></li>'
		);
		
		// Scroll
		window.location.href = '#conv-' + clength;
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
	questionStart : function(tmpquestion,tab){
		var retour = false;
		for(var i= 0; i < tab.length; i++){
			if(tmpquestion.substr(0,tab[i].length) == tab[i]){
				retour = true;
			}
		}
		return retour;
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
