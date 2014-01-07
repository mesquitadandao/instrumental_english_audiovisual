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
	this.appID = 'TU58_reVVTYOQfH94UXRZxbUpxXRFOT7aLDzG1eOBgM0*';
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
		var script = _script.gsub(/HOST/, _host).gsub(/APPID/, this.appID).
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

var MDAudio = function(appID){
	var _src = "http://api.microsofttranslator.com/v2/http.svc/Speak?format=audio/mp3&options=MaxQuality&appid="+
						appID + "&language=LANGUAGE&text=TEXT";

	this.build = function(language, text){
		return function() { return new Audio(_src.gsub(/LANGUAGE/,language).gsub(/TEXT/, text));};
	};
}

var MDT = new MDTranslator();
var MDA = new MDAudio(MDT.appID);