module('extractUniqueWordsEnglish');

test('return Array ["i","will","i\'m","you","go","want","now","english","is","not"].', function() {
	var expected = ["i","will","i\'m","you","go","want","now","english","is","not"]+"";

	var extracted = "I will. I'm. You go. I want. Go now. 'English' is not \"english\", 2014/01/01 :-) ;_".extractUniqueWordsEnglish()+"";
	equal(extracted, expected, 'when send in String "I will. I\'m. You go. I want. Go now. \'English\' is not "english", 2014/01/01 :-) ;_"');
});

module('MDTranslator');

test('return Array [{"origin":{"text":"i","audio":function(){return new MDAudio("i","en");}},"translation":{"text":"eu","audio":function(){return new MDAudio("eu","pt");}}},'+
	'{"origin":{"text":"you","audio":function(){return new MDAudio("you","en");}},"translation":{"text":"você","audio":function(){return new MDAudio("você","pt");}}}].', function() {
	var expected = [{"origin":{"text":"i","audio":function(){return MDA.build("en",'i');}},"translation":{"text":"eu","audio":function(){return new MDA.build("pt","eu");}}},
									{"origin":{"text":"you","audio":function(){return new MDA.build("en","you");}},"translation":{"text":"você","audio":function(){return new MDA.build("pt","você");}}}];
	var translateds = [];
	MDTranslator.prototype.completed = function(translations){
		translateds = translations;
	}
	MDT.words(["i","you"]).to("pt");
	while(MDT.translating()){};
	equal(translateds, expected, 'when send MDT.words(["i","you"]).to("pt")');
});