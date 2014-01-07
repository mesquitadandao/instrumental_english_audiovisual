$(function(){
	var $fullText = $("#full-text");
	var $extractUniqueWords = $("#extract-unique-words");
	var $uniqueWords = $("#unique-words");
	var $vocabulary = $("#vocabulary");
	var $vocabularyBody = $vocabulary.find('tbody');
	var lastTranslations = [];

	var applyAudio = function(){
		$(".play").off("click.play").on("click.play", function(){
			var $this = $(this);
			$this.attr('disabled','disabled').removeClass('fa-play').addClass('fa-pause');
			var $parent = $this.parent();
			var audio = lastTranslations[$parent.data("index")][$parent.data("key")].audio();
			audio.onended = function(){$this.attr('disabled',null).removeClass('fa-pause').addClass('fa-play');};
			audio.play();
		});
	}

	MDTranslator.prototype.completed = function(translations){
		lastTranslations = translations;
		for(var i = 0; i < lastTranslations.length; i++){
			$vocabularyBody.append('<tr><td data-index="'+i+'" data-key="origin"><button class="fa fa-play play"></button> '+lastTranslations[i].origin.text+'</td><td  data-index="'+i+'" data-key="translation"><button class="fa fa-play play"></button> '+lastTranslations[i].translation.text+'</td><tr>');
		};
		applyAudio();
	}

	$extractUniqueWords.on("click.extract", function(){
		$vocabularyBody.empty();
		var extrateds = $fullText.val().extractUniqueWordsEnglish();
		MDT.words(extrateds).to("pt");
	});
});
