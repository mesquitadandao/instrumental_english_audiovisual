$(function(){
	var $startNow = $('#start-now');
	var $yourText = $("#your-text");
	var $yourLanguage = $("#your-language");
	var $yourVocabularyDiv = $("#your-vocabulary-div");
	var $yourVocabularyBody = $("#your-vocabulary-body");
	var lastTranslations = [];
	var limitRepeat = null;
	var singlePlay = true;
	var actualAudio = null;

	var $progressTranslation = $("#progress-translation");
	var $errorTranslation = $("#error-translation");

	var iconPlay = "glyphicon-play";
	var iconStop = "glyphicon-stop";
	var iconPlaying = "glyphicon-volume-up";

	var applyAudio = function(){
		$(".play").off("click.play").on("click.play", function(){
			var $this = $(this);
			var index = $this.data('index');
			var key = $this.data('key');
			var $parentTD = $this.closest("td");
			if(singlePlay){
				$this.removeClass("play");
			}
			var outherPlays = $(".play, #play-origin, #play-translation, #play-all, #start-now");
			outherPlays.attr('disabled', 'disabled');
			$parentTD.addClass('success');
			$this.removeClass(iconPlay).addClass(singlePlay?iconStop:iconPlaying);
			if (!(lastTranslations[index][key].audio instanceof HTMLAudioElement)){
				lastTranslations[index][key].audio = lastTranslations[index][key].audio();
			}
			var audio = lastTranslations[index][key].audio;
			if (!audio.playing){
				var next = lastTranslations[index][key].next || function(){};
				if (next instanceof Next){
					audio.onended = function(){
						$this.removeClass(singlePlay?iconStop:iconPlaying).addClass(iconPlay);
						$parentTD.removeClass('success');
						outherPlays.attr('disabled', null);
						if(singlePlay){
							$this.addClass("play");
						}
						this.playing = false;
						next.exec();
					};
				}else{
					audio.onended = function(){
						$this.removeClass(singlePlay?iconStop:iconPlaying).addClass(iconPlay);
						$parentTD.removeClass('success');
						outherPlays.attr('disabled', null);
						if(singlePlay){
							$this.addClass("play");
						}
						this.playing = false;
						next();
					};
				}
				audio.onerror = function(){this.onended();};
				actualAudio = audio;
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
			var $this = $(this);
			if(singlePlay){
				var $plays = $(".play[data-key="+key+"]");
				for(var i = 0; i < lastTranslations.length - 1; i++){
					var next = $plays[i+1];
					lastTranslations[i][key].next = new Next(next);
				}
				var next = $plays[0];
				lastTranslations[lastTranslations.length - 1][key].next = new Next(next);
				if($plays[0]){
					limitRepeat = $("#play-"+key+"-repeat").val();
					$this.attr("id", null);
					$this.removeClass(iconPlay).addClass(iconStop);
					singlePlay = false;
					$plays[0].click();
				}
			}else{
				for(var i = 0; i < lastTranslations.length; i++){
					lastTranslations[i][key].next = null;
				}
				$this.attr("id", "play-"+key);
				$this.removeClass(iconStop).addClass(iconPlay);
				actualAudio.stop();
				actualAudio.onended();
				singlePlay = true;
				limitRepeat = null;
			}
		});
	};

	var applyNextAll = function(){
		$("#play-all").off("click.play").on("click.play", function(){
			var $this = $(this);
			if(singlePlay){
				var $originPlays = $(".play[data-key=origin]");
				var $translationPlays = $(".play[data-key=translation]");
				var $originTranslation = $('#play-origin, #play-translation');
				for(var i = 0; i < lastTranslations.length - 1; i++){
					var nextTranslation = $translationPlays[i];
					lastTranslations[i].origin.next = new Next(nextTranslation);
					var nextOrigin = $originPlays[i+1];
					lastTranslations[i].translation.next = new Next(nextOrigin);
				}
				var nextTranslation = $translationPlays[lastTranslations.length-1];
				lastTranslations[lastTranslations.length-1].origin.next = new Next(nextTranslation);
				var nextOrigin = $originPlays[0];
				lastTranslations[lastTranslations.length-1].translation.next = new Next(nextOrigin);
				if($originPlays[0]){
					limitRepeat = $("#play-all-repeat").val();
					$this.attr("id", null);
					$this.removeClass(iconPlay).addClass(iconStop);
					singlePlay = false;
					$originPlays[0].click();
				}
			}else{
				for(var i = 0; i < lastTranslations.length; i++){
					lastTranslations[i].origin.next = null;
					lastTranslations[i].translation.next = null;
				}
				$this.attr("id", "play-all");
				$this.removeClass(iconStop).addClass(iconPlay);
				actualAudio.stop();
				actualAudio.onended();
				singlePlay = true;
				limitRepeat = null;
			}
		});
	};

	MDTranslator.prototype.completed = function(translations){
		$progressTranslation.addClass('hidden');
		$startNow.attr('disabled', false);
		if(translations.length > 0){
			lastTranslations = translations;
			for(var i = 0; i < lastTranslations.length; i++){
				$yourVocabularyBody.append('<tr><td><h6><button class="btn btn-default btn-sm glyphicon ' + iconPlay +
					' play" data-index="' + i + '" data-key="origin"></button> ' + lastTranslations[i].origin.text +
					'</h6></td><td><h6><button class="btn btn-default btn-sm glyphicon ' + iconPlay + ' play" data-index="' +
					i + '" data-key="translation"></button> '+lastTranslations[i].translation.text+'</h6></td><tr>');
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
		$startNow.attr('disabled', true);
		var extrateds = $yourText.val().extractUniqueWordsEnglish();
		MDT.words(extrateds).to($yourLanguage.data("selected").data("code"));
	});

	$("input[type=number]").mask("9");

	$(".language").on("click", function(){
		var $this = $(this);
		var $selected = $yourLanguage.data("selected");
		$yourLanguage.data('selected', $this);
		$this.addClass("hidden");
		if($selected){
			$selected.removeClass("hidden");
		}
		$yourLanguage.val($(this).text());
	});
});