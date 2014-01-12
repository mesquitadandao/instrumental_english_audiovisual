;String.prototype.extractUniqueWordsEnglish = function(){
	return this.
	toLowerCase().
	gsub(/'\s|\s'/, " ").
	gsub(/_/, " ").
	gsub(/'/, "_").
	gsub(/\W|\d/, " ").
	gsub(/_/, "'").
	gsub(/\s+/, " ").
	trim().
	split(/\s/).
	uniq();
};

var MDTranslator = function(){
	// http://msdn.microsoft.com/en-us/library/ff512407.aspx
	var _host = 'http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray2';
	var _script = '_HOST_?appId=_APPID_&oncomplete=MDT._continue&onerror=MDT._break&texts=_TEXTS_&from=_FROM_&to=_TO_';
	var _words = [];
	var _texts = null;
	var _from = 'en';
	var _to;
	var _translating = false;

	this.words = function(words){
		_texts = '["'+words.join('","')+'"]';
		_words = words;
		return this;
	};

	this.from = function(languageCode){
		_from = languageCode;
		return this;
	};

	this.to = function(languageCode){
		_to = languageCode;
		var script = _script.gsub(/_HOST_/, _host).gsub(/_APPID_/, window._mstConfig.appId).
		gsub(/_TEXTS_/, _texts).gsub(/_FROM_/, _from).gsub(/_TO_/, _to);
		_translating = true;
		$.getScript(script);
	};

	this._continue = function(response){
		var translations = [];
		for(var i = 0; i < response.length; i++){
			var originText = _words[i];
			var originLang = _from;
			var originAudio = MDA.build(originLang,originText);
			var translationText = response[i].TranslatedText.toLowerCase();
			var translationLang = _to;
			var translationAudio = MDA.build(translationLang,translationText);
			translations.push({"origin":{"text":originText,"audio": originAudio},"translation":{"text":translationText,"audio": translationAudio}});
		}
		this.completed(translations);
		_translating = false;
	};

	this._break = function(response){
		this.completed([]);
		_translating = false;
	};

	this.translating = function(){
		return _translating;
	};
}

Audio.prototype.defaultPlay = Audio.prototype.play;
Audio.prototype.playing = false;
Audio.prototype.newPlay = true;
Audio.prototype.play = function(limitRepeat){
	if(limitRepeat){
		if (limitRepeat > 1){
			var played = this.newPlay? 2: 1;
			this.loop = true;
			this.onseeked = function(){ this.loop = played++ < limitRepeat; };
		}
	}else{
		this.loop = true;
		this.onseeked = function(){};
	}
	this.playing = true;
	this.newPlay = false;
	this.defaultPlay();		
};
Audio.prototype.stop = function(){
	this.loop = false;
};

var MDAudio = function(appID){
	var _src = 'http://translate.google.com/translate_tts?ie=UTF-8&q=_TEXT_&tl=_LANGUAGE_';

	this.build = function(language, text){
		return function() { return new Audio(_src.
			gsub(/_LANGUAGE_/, language.gsub(/zh-CHS/, "zh-CN").gsub(/zh-CHT/, "zh-TW")).gsub(/_TEXT_/, text));};
	};
}

//$.getScript('http://www.microsofttranslator.com/Ajax/V2/Toolkit.ashx');
var MDT = new MDTranslator();
var MDA = new MDAudio(MDT.appID);