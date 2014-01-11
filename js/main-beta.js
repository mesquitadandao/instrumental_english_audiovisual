$(function(){
	var $beginNow = $('#begin-now');
	var $yourText = $("#your-text");
	var $yourVocabularyDiv = $("#your-vocabulary-div");
	var $yourVocabularyBody = $("#your-vocabulary-body");
	var lastTranslations = [];
	var limitRepeat = null;

	var $progressTranslation = $("#progress-translation");
	var $errorTranslation = $("#error-translation");

	var iconPlay = "glyphicon-play";
	var iconStop = "glyphicon-stop";

	var applyAudio = function(){
		$(".play").off("click.play").on("click.play", function(){
			var $this = $(this);
			var index = $this.data('index');
			var key = $this.data('key');
			var $parentTD = $this.closest("td");
			$this.removeClass("play");
			var outherPlays = $(".play, #play-origin, #play-translation, #play-all");
			outherPlays.attr('disabled', 'disabled');
			$parentTD.addClass('success');
			$this.removeClass(iconPlay).addClass(iconStop);
			if (!(lastTranslations[index][key].audio instanceof HTMLAudioElement)){
				lastTranslations[index][key].audio = lastTranslations[index][key].audio();
			}
			var audio = lastTranslations[index][key].audio;
			if (!audio.playing){
				var next = lastTranslations[index][key].next || function(){};
				if (next instanceof Next){
					audio.onended = function(){
						$this.removeClass(iconStop).addClass(iconPlay);
						$parentTD.removeClass('success');
						outherPlays.attr('disabled', null);
						$this.addClass("play");
						this.playing = false;
						next.exec();
					};
				}else{
					audio.onended = function(){
						$this.removeClass(iconStop).addClass(iconPlay);
						$parentTD.removeClass('success');
						outherPlays.attr('disabled', null);
						$this.addClass("play");
						this.playing = false;
						next();
					};
				}
				audio.onerror = function(){this.onended();};
				audio.play(limitRepeat);
			}else{
				audio.stop();
			}
		});
	}
		
	var Next = function(next){
		var _next = next;
		this.exec = function(){
			_next.click();
		};
	};

	var applyNextKey = function(key){
		$("#play-"+key).off("click.play").on("click.play", function(){
			var $plays = $(".play[data-key="+key+"]");
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
						$this.attr('disabled',null).removeClass(iconStop).addClass(iconPlay);
						limitRepeat = null;
					};
				}
			}
			if($plays[0]){
				$this.attr('disabled','disabled').removeClass(iconPlay).addClass(iconStop);
				limitRepeat = 2;
				$plays[0].click();
			}
		});
	};

	var applyNextAll = function(){
		$("#play-all").off("click.play").on("click.play", function(){
			var $originPlays = $(".play-origin");
			var $translationPlays = $(".play-translation");

			var $this = $(this);
			var $originTranslation = $('#play-origin, #play-translation');
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
						$this.attr('disabled',null).removeClass(iconStop).addClass(iconPlay);
						$originTranslation.attr('disabled',null).removeClass(iconStop).addClass(iconPlay);
					};
				}
			}
			if($originPlays[0]){
				$this.attr('disabled','disabled').removeClass(iconPlay).addClass(iconStop);
				$originTranslation.attr('disabled','disabled').removeClass(iconPlay).addClass(iconStop);
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
				$yourVocabularyBody.append('<tr><td><h4><button class="btn btn-default glyphicon ' + iconPlay +
					' play" data-index="' + i + '" data-key="origin"></button> ' + lastTranslations[i].origin.text +
					'</h4></td><td><h4><button class="btn btn-default glyphicon ' + iconPlay + ' play" data-index="' +
					i + '" data-key="translation"></button> '+lastTranslations[i].translation.text+'</h4></td><tr>');
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