$(function(){
	var $fullText = $("#full-text");
	var $extractUniqueWords = $("#extract-unique-words");
	var $uniqueWords = $("#unique-words");
	
	$extractUniqueWords.on("click.extract", function(){
		$uniqueWords.val($fullText.val().extractUniqueWordsEnglish());		
	});
});