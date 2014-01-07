module('extractUniqueWordsEnglish');

test('return Array ["i","will","i\'m","you","go","want","now","english","is","not"].', function() {
	var expected = ["i","will","i\'m","you","go","want","now","english","is","not"]+"";

	var extracted = "I will. I'm. You go. I want. Go now. 'English' is not \"english\", 2014/01/01 :-) ;_".extractUniqueWordsEnglish()+"";
	equal(extracted, expected, 'when send in String "I will. I\'m. You go. I want. Go now. \'English\' is not "english", 2014/01/01 :-) ;_"');
});

module('Translation');

test('return Array [{"origin":"i", "translation":"eu"},{"origin":"you", "translation":"você"}].', function() {
	var expected = [{"origin":"i", "translation":"eu"},{"origin":"you", "translation":"você"}]+"";
	var translateds = [];
	Translation.prototype.success = function(translations){
		translateds = translations;
	}
	TRANSLATION.words(["i","you"]).to("pt");
	while(TRANSLATION.translating()){};
	equal(translateds, expected, 'when send TRANSLATION.words(["i","you"]).to("pt")');
});