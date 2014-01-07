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

var Translation = function() {
	this.HOST = 'http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray2';
	this.APPID = 'THxUiA69g9O-X27g2Er6pTPh_G4-yOmfeNGwVI4ISTDc*';
	this.WORDS = [];
	this.TEXTS = null;
	this.FROM = 'en';
	this.TRANSLATING = false;

	this.words = function(words){
		this.TEXTS = '["'+words.join('","')+'"]';
		this.WORDS = words;
		return this;
	};

	this.from = function(languageCode){
		this.FROM = languageCode;
		return this;
	};

	this.to = function(languageCode){
		var script = 'HOST?appId=APPID&oncomplete=TRANSLATION._continue&onerror=TRANSLATION._break&texts=TEXTS&from=FROM&to=TO'.
		gsub(/HOST/, this.HOST).gsub(/APPID/, this.APPID).gsub(/TEXTS/, this.TEXTS).
		gsub(/FROM/, this.FROM).gsub(/TO/, languageCode);
		this.TRANSLATING = true;
		$.getScript(script);
	};

	this._continue = function(response){
		var translations = [];
		for(var i = 0; i < response.length; i++){
			translations.push({"origin":this.WORDS[i], "translation":response[i].TranslatedText.toLowerCase()});
		}
		this.success(translations);
		this.TRANSLATING = false;
	};

	this._break = function(response){
		this.fail();
		this.TRANSLATING = false;
	};

	this.translating = function(){
		return this.TRANSLATING;
	};
}
var TRANSLATION = new Translation();