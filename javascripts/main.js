$(function(){
	var $fullText = $("#full-text");
	var $extractUniqueWords = $("#extract-unique-words");
	var $uniqueWords = $("#unique-words");
	var $vocabulary = $("#vocabulary");
	var $vocabularyBody = $vocabulary.find('tbody');

	var applyAudio = function(){
		var audioSRC = "http://api.microsofttranslator.com/v2/http.svc/Speak?language=LANGUAGE&format=audio/mp3&options=MaxQuality&appid=Ti76r0niYnjycWYV5-dAuTZnpN3gyKN7uzCKten66PoM*&text=TEXT";
		$(".play").off("click.play").on("click.play", function(){
			var $this = $(this);
			$this.attr('disabled','disabled').removeClass('fa-play').addClass('fa-pause');
			var audio = new Audio(audioSRC.gsub(/LANGUAGE/,$this.parent().data("lang")).gsub(/TEXT/, $this.parent().find("span").text()));
			audio.onended = function(){$this.attr('disabled',null).removeClass('fa-pause').addClass('fa-play');;}
			audio.play();
		});
	}

	Translation.prototype.success = function(translations){
		for(var i = 0; i < translations.length; i++){
			$vocabularyBody.append('<tr><td data-lang="en"><button class="fa fa-play play"></button> <span>'+translations[i].origin+'</span></td><td data-lang="pt"><button class="fa fa-play play"></button> <span>'+translations[i].translation+'</span></td><tr>');
		};
		applyAudio();
	}

	$extractUniqueWords.on("click.extract", function(){
		$vocabularyBody.empty();
		var extrateds = $fullText.val().extractUniqueWordsEnglish();
		TRANSLATION.words(extrateds).to("pt");
	});

	applyAudio();
});
