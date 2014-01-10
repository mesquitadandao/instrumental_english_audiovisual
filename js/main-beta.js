$(function(){
	var $beginNow = $('#begin-now');
	var $yourText = $("#your-text");
	var $yourVocabularyDiv = $("#your-vocabulary-div");
	var $yourVocabularyBody = $("#your-vocabulary-body");
	var lastTranslations = [];

	var $progressTranslation = $("#progress-translation");
	var $errorTranslation = $("#error-translation");

	var applyAudio = function(){
		$(".play-origin, .play-translation").off("click.play").on("click.play", function(){
			var $this = $(this);
			var $parent = $this.parent().parent();
			$parent.addClass('success');
			$this.attr('disabled','disabled').removeClass('glyphicon-play').addClass('glyphicon-volume-up');
			var audio = lastTranslations[$parent.data("index")][$parent.data("key")].audio();
			var next = lastTranslations[$parent.data("index")][$parent.data("key")].next || function(){};
			if (next instanceof Next){
				audio.onended = function(){$this.attr('disabled',null).removeClass('glyphicon-volume-up').addClass('glyphicon-play');$parent.removeClass('success');
;next.exec();};
			}else{
				audio.onended = function(){$this.attr('disabled',null).removeClass('glyphicon-volume-up').addClass('glyphicon-play');$parent.removeClass('success');
next();};
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
					$this.attr('disabled',null).removeClass('glyphicon-volume-up').addClass('glyphicon-play');
					};
				}
			}
			if($plays[0]){
				$this.attr('disabled','disabled').removeClass('glyphicon-play').addClass('glyphicon-volume-up');
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
					$this.attr('disabled',null).removeClass('glyphicon-volume-up').addClass('glyphicon-play');
					$originTranslation.attr('disabled',null).removeClass('glyphicon-volume-up').addClass('glyphicon-play');
					};
				}
			}
			if($originPlays[0]){
				$this.attr('disabled','disabled').removeClass('glyphicon-play').addClass('glyphicon-volume-up');
				$originTranslation.attr('disabled','disabled').removeClass('glyphicon-play').addClass('glyphicon-volume-up');
				$originPlays[0].click();
			}
		});
	};

	MDTranslator.prototype.completed = function(translations){
		$progressTranslation.addClass('hidden');
		$beginNow.attr('disabled', false);
		if(translations.length > 0){
			lastTranslations = translations;
			for(var i = 0; i < lastTranslations.length; i++){
				$yourVocabularyBody.append('<tr><td data-index="'+i+'" data-key="origin"><h4><button class="btn btn-default glyphicon glyphicon-play play-origin"></button> '+lastTranslations[i].origin.text+'</h4></td><td  data-index="'+i+'" data-key="translation"><h4><button class="btn btn-default glyphicon glyphicon-play play-translation"></button> '+lastTranslations[i].translation.text+'</h4></td><tr>');
			};
			applyAudio();
			applyNextKey('origin');
			applyNextKey('translation');
			applyNextAll();
			$yourText.val("");
		}else{
			var $errorTranslationClone = $errorTranslation.clone();
			$errorTranslationClone.removeClass('hidden');
			$errorTranslationClone.appendTo($errorTranslation.parent());
		}
	};

	$('#form-your-text').on("submit.generate-your-vacabulary", function(){
		$("#myModal").modal("hide");
		$yourVocabularyBody.empty();
		$progressTranslation.removeClass('hidden');
		$beginNow.attr('disabled', true);
		var extrateds = $yourText.val().extractUniqueWordsEnglish();
		MDT.words(extrateds).to("pt");
	});
});