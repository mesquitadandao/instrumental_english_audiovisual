$(function(){
	var $fullText = $("#full-text");
	var $extractUniqueWords = $("#extract-unique-words");
	var $uniqueWords = $("#unique-words");
	var $vocabulary = $("#vocabulary");
	var $vocabularyBody = $vocabulary.find('tbody');
	var lastTranslations = [];

	var applyAudio = function(){
		$(".play-origin, .play-translation").off("click.play").on("click.play", function(){
			var $this = $(this);
			$this.attr('disabled','disabled').removeClass('fa-play').addClass('fa-pause');
			var $parent = $this.parent();
			var audio = lastTranslations[$parent.data("index")][$parent.data("key")].audio();
			var next = lastTranslations[$parent.data("index")][$parent.data("key")].next
			if (next instanceof Next){
				audio.onended = function(){$this.attr('disabled',null).removeClass('fa-pause').addClass('fa-play');next.exec();};
			}else{
				audio.onended = function(){$this.attr('disabled',null).removeClass('fa-pause').addClass('fa-play');};
			}
			audio.play();
		});
	}

	var Next = function(next){
		var _next = next;
		this.exec = function(){
			_next.click();
		};
	};

	var applyNextKey = function(key){
		$(".play-"+key+"-all").on("click.play", function(){
			var $plays = $(".play-"+key);
			for(var i = 0; i < lastTranslations.length; i++){
				if (i < lastTranslations.length - 1){
					var next = $plays[i+1];
					lastTranslations[i][key].next = new Next(next);
				}else{
					lastTranslations[i][key].next = function(){
						for(var j = 0; j < lastTranslations.length; j++){
							lastTranslations[j][key].next = null;
						}
					};
				}
			}
			if($plays[0]){
				$plays[0].click();
			}
		});
	};

	MDTranslator.prototype.completed = function(translations){
		lastTranslations = translations;
		for(var i = 0; i < lastTranslations.length; i++){
			$vocabularyBody.append('<tr><td data-index="'+i+'" data-key="origin"><button class="fa fa-play play-origin"></button> '+lastTranslations[i].origin.text+'</td><td  data-index="'+i+'" data-key="translation"><button class="fa fa-play play-translation"></button> '+lastTranslations[i].translation.text+'</td><tr>');
		};
		applyAudio();
		applyNextKey('origin');
		applyNextKey('translation');
	}

	$extractUniqueWords.on("click.extract", function(){
		$vocabularyBody.empty();
		var extrateds = $fullText.val().extractUniqueWordsEnglish();
		MDT.words(extrateds).to("pt");
	});
});