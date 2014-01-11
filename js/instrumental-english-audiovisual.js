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
	var _script = 'HOST?appId=APPID&oncomplete=MDT._continue&onerror=MDT._break&texts=TEXTS&from=FROM&to=TO';
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
		var script = _script.gsub(/HOST/, _host).gsub(/APPID/, window._mstConfig.appId).
		gsub(/TEXTS/, _texts).gsub(/FROM/, _from).gsub(/TO/, _to);
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
Audio.prototype.play = function(limitRepeat){
	if(limitRepeat){
		if(limitRepeat === 2){
			this.loop = true;
			this.onseeked = function(){ this.loop = false; };
		}else if (limitRepeat > 2){
			var played = 1;
			this.loop = true;
			this.onseeked = function(){ this.loop = played++ < limitRepeat; };
		}
	}else{
		this.loop = true;
	}
	this.playing = true;
	this.defaultPlay();		
};
Audio.prototype.stop = function(){
	this.loop = false;
};

var MDAudio = function(appID){
	// http://msdn.microsoft.com/en-us/library/ff512405.aspx
	var _src = "http://api.microsofttranslator.com/v2/http.svc/Speak?format=audio/mp3&options=MaxQuality&appid=APPID&language=LANGUAGE&text=TEXT";

	this.build = function(language, text){
		return function() { return new Audio(_src.gsub(/APPID/, window._mstConfig.appId).
			gsub(/LANGUAGE/, language).gsub(/TEXT/, text));};
	};
}

//$.getScript('http://www.microsofttranslator.com/Ajax/V2/Toolkit.ashx');
var MDT = new MDTranslator();
var MDA = new MDAudio(MDT.appID);