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
			var next = lastTranslations[$parent.data("index")][$parent.data("key")].next || function(){};
			if (next instanceof Next){
				audio.onended = function(){$this.attr('disabled',null).removeClass('fa-pause').addClass('fa-play');next.exec();};
			}else{
				audio.onended = function(){$this.attr('disabled',null).removeClass('fa-pause').addClass('fa-play'); next();};
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
		$(".play-"+key+"-all").off("click.play").on("click.play", function(){
			var $plays = $(".play-"+key);
			var $this = $(this);
			for(var i = 0; i < lastTranslations.length; i++){
				if (i < lastTranslations.length - 1){
					var next = $plays[i+1];
					lastTranslations[i][key].next = new Next(next);
				}else{
					lastTranslations[i][key].next = function(){
						for(var j = 0; j < lastTranslations.length; j++){
							lastTranslations[j][key].next = null;
						}
					$this.attr('disabled',null).removeClass('fa-pause').addClass('fa-play');
					};
				}
			}
			if($plays[0]){
				$this.attr('disabled','disabled').removeClass('fa-play').addClass('fa-pause');
				$plays[0].click();
			}
		});
	};

	var applyNextAll = function(){
		$(".play-all").off("click.play").on("click.play", function(){
			var $originPlays = $(".play-origin");
			var $translationPlays = $(".play-translation");

			var $this = $(this);
			var $originTranslation = $('.play-origin-all, .play-translation-all');
			for(var i = 0; i < lastTranslations.length; i++){
				if (i < lastTranslations.length - 1){
					var nextTranslation = $translationPlays[i];
					lastTranslations[i].origin.next = new Next(nextTranslation);
					var nextOrigin = $originPlays[i+1];
					lastTranslations[i].translation.next = new Next(nextOrigin);
				}else{
					var nextTranslation = $translationPlays[i];
					lastTranslations[i].origin.next = new Next(nextTranslation);
					lastTranslations[i].translation.next = function(){
						for(var j = 0; j < lastTranslations.length; j++){
							lastTranslations[j].origin.next = null;
							lastTranslations[j].translation.next = null;
						}
					$this.attr('disabled',null).removeClass('fa-pause').addClass('fa-play');
					$originTranslation.attr('disabled',null).removeClass('fa-pause').addClass('fa-play');
					};
				}
			}
			if($originPlays[0]){
				$this.attr('disabled','disabled').removeClass('fa-play').addClass('fa-pause');
				$originTranslation.attr('disabled','disabled').removeClass('fa-play').addClass('fa-pause');
				$originPlays[0].click();
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
		applyNextAll();
	}

	$extractUniqueWords.on("click.extract", function(){
		$vocabularyBody.empty();
		var extrateds = $fullText.val().extractUniqueWordsEnglish();
		MDT.words(extrateds).to("pt");
	});
});