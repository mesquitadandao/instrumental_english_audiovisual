$(function(){
	var $fullText = $("#full-text");
	var $extractUniqueWords = $("#extract-unique-words");
	var $uniqueWords = $("#unique-words");
	var $vocabulary = $("#vocabulary");
	var $vocabularyBody = $vocabulary.find('tbody');

	Translation.prototype.success = function(translations){
		for(var i = 0; i < translations.length; i++){
			$vocabularyBody.append('<tr><td>'+translations[i].origin+'</td><td>'+translations[i].translation+'</td><tr>');
		};
	}

	$extractUniqueWords.on("click.extract", function(){
		$vocabularyBody.empty();
		var extrateds = $fullText.val().extractUniqueWordsEnglish();
		TRANSLATION.words(extrateds).to("pt");
	});
});