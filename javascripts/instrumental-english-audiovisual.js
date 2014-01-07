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

var Translator = function(){
	var _host = 'http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray2';
	var _appID = 'TU58_reVVTYOQfH94UXRZxbUpxXRFOT7aLDzG1eOBgM0*';
	var _script = 'HOST?appId=APPID&oncomplete=_T_._continue&onerror=_T_._break&texts=TEXTS&from=FROM&to=TO';
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
		var script = _script.gsub(/HOST/, _host).gsub(/APPID/, _appID).
		gsub(/TEXTS/, _texts).gsub(/FROM/, _from).gsub(/TO/, _to);
		_translating = true;
		$.getScript(script);
	};

	this._continue = function(response){
		var translations = [];
		for(var i = 0; i < response.length; i++){
			translations.push({"origin": _words[i], "translation":response[i].TranslatedText.toLowerCase()});
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

var _T_ = new Translator();
var TRANSLATOR = _T_;