var count = 20;
var counter = setInterval(timer, 1000);
var timerStart;
var points = 0;
var winPoint = false;
var wonWithAlt = false;
var imgLoaded = 0;

var message_win = ["Nice catch! ", "Good one! ", "You're clever! ", "Keep up! ", "Nice one! ", "Don't stop! "];
var message_lose = ["Looooser...", "Game over.", "You lose!"];


function closeIntro() {
    $("#intro").hide();
    $(".intro__overlay").hide();
    $(".game").show();
}

function init(){
    $(".overlay").hide();
}

function activeTimer(){
    timerStart = true;
    // The player may have typed the answer while the GIFs were still loading.
    validateAnswer();
}

function timer(){
    if(timerStart == true){
        count=count-1;
        $(".timer-bar__number").empty();
        $(".timer-bar__number").append('' + count + '');
        if (count < 10){
            $(".timer-bar__title").hide();
        }
        if (count === 10){
            showHint(true);
        }

        if (count < 0){
            loseGame();
            return;
        }
    }
    $(".timer-bar").css("width", count * 5 + "%");
}

function winGame(){
    $(".overlay__win").show();
    $(".overlay__win").css({"z-index":"9999"});
    $("input").prop('disabled', true);
    timerStart = false;
    var rand_win_message = message_win[Math.floor(Math.random() * message_win.length)];
    $(".win-message").append('' + rand_win_message + '');
    if (wonWithAlt){
        $(".win-message").append('<span class="title-note">In English: ' + answer_key + '</span>');
    }
    points++;
    $(".points-overlay").empty();
    $(".points-overlay").append('' + points + '');
    $(".scoreboard__value-h5").removeClass("scoreboard__value-h5-animation");
    $(".gif__answer-text").removeClass("gif__answer-animate");
}

function showLeaderboard(){
    $(".leaderboard").removeClass("hide");
    $(".leaderboard__input").addClass("hide");
    $(".lose-info-js").addClass("hide");
    $(".play-again-js").removeClass("hide");
}

function hideLeaderboard(){
    $(".leaderboard").addClass("hide");
    $(".lose-info-js").removeClass("hide");
}

function loseGame(){
    $(".overlay__lose").show();
    $(".overlay__lose").css({"opacity":"1","z-index":"9999"});
    $("#answer").prop('disabled', true);
    $(".lose-result").append('<h4><span class="title-note-big">' + answer_key + '</span> was the word.</h4>');
    var rand_lose_message = message_lose[Math.floor(Math.random() * message_lose.length)];
    $(".lose-message").append('' + rand_lose_message + '');
    timerStart = false;
    $(".scoreboard__value-h5").removeClass("scoreboard__value-h5-animation");
    $(".gif__answer-text").removeClass("gif__answer-animate");
    if(points > 0){
        $(".leaderboard__input").removeClass("hide");
    }
    else{
        $(".play-again-js").removeClass("hide");
    }
}



function clearWinOverlay(){
    $(".lose-result").empty();
    $(".win-message").empty();
    $(".lose-message").empty();
    winPoint = false;
}

function resetPoints(){
    $(".scoreboard__value").empty();
    $(".points-overlay").empty();
    $(".points-overlay").append('' + 0 + '');
    $(".scoreboard__value").append('' + 0 + '');
    points = 0;
}

function newGif(){
    $(".gif__image").remove();
    $(".overlay").hide();
    $("input").prop('disabled', false).val('');
    $(".scoreboard__value").empty();
    $(".scoreboard__value").append('' + points + '');
    $(".play-again-js").addClass("hide");
    $(".timer-bar").addClass("timer-bar--intro");
    $(".timer-bar__title").show();
    $(".scoreboard__value-h5").addClass("scoreboard__value-h5-animation");
    $(".gif__answer-text").addClass("gif__answer-animate");
    if ($(window).width() > 600) {
      $("input").focus();
    }
    clearWinOverlay();
    answer_key = null;
    $("#answer").attr("placeholder", "Loading...");
    getGifs();
    imgLoaded = 0;
    winPoint = false;
    count = 21;
}

function loadFunc(){
    imgLoaded++;
    if(imgLoaded == 4){
        activeTimer();
        $('.gif__image-loader').addClass('gif__image--loaded');
    }
}

function loadIntroFunc(){
    $(".intro__background").addClass("intro__background--loaded");
}

function toggleIntroDialog(){
    $(".intro__dialog").toggleClass("intro__dialog--visible");
}

// Ignore case, accents, spaces and punctuation: "Homem-Aranha" counts as "homemaranha".
function normaliseAnswer(text){
  var plain = text.toLowerCase();
  if (plain.normalize) plain = plain.normalize("NFD");
  return plain.replace(/[^a-z0-9]/g, "");
}

// Forgive doubled letters and singular/plural: "wafle", "waffle" and "waffles" all match.
// Short words stay strict, so "we" doesn't count as "wwe".
function looseAnswer(text){
  var plain = normaliseAnswer(text);
  if (plain.length < 4) return plain;
  plain = plain.replace(/(.)\1+/g, "$1");
  if (plain.length > 4) plain = plain.replace(/s$/, "");
  return plain;
}

function isOtherWord(plain){
  return plain !== answer_key && WORDS.some(function(word){ return word.w === plain; });
}

function matchesAnswer(guess, target){
  if (guess === normaliseAnswer(target)) return true;
  // Loose match, unless the guess is a different word in the game ("tiger" is not "tigger").
  return !isOtherWord(guess) && looseAnswer(guess) === looseAnswer(target);
}

function validateAnswer(){
  if(!answer_key || !timerStart) return;
  var guess = normaliseAnswer($("#answer").val());
  var alternatives = (current_word && current_word.alt) || [];
  var isAlt = !matchesAnswer(guess, answer_key) && alternatives.some(function(alt){ return matchesAnswer(guess, alt); });
  if(matchesAnswer(guess, answer_key) || isAlt){
    wonWithAlt = isAlt;
    winPoint = true;
    winGame();
  }
}


jQuery(function($) {
    $(".game").hide();

    $(".change-view-mode").click(function() {
        $(".gif__image").toggleClass("gif__image--line");
        $(".scoreboard__button").toggleClass("scoreboard__button--show");
        $("input").focus();
    });

    $(document).ready(function() {
        $(".overlay").hide();
        $(".points-overlay").append('' + 0 + '');
        console.log("Naughy naughty... What are you doing here? Go back to the game!");
    });

    $("#answer").keyup(function() {
      validateAnswer();
    });

    $(".key-js").click(function() {
      $("#answer").val($('#answer').val() + $(this).text());
      validateAnswer();
    });

    $(".key-del-js").click(function() {
      $("#answer").val("");
    });

    $(".key-back-js").click(function() {
      $("#answer").val(function(index, value){
        return value.substr(0, value.length - 1);
      })
    });

    $(document).keypress(function(e) {
        if(e.keyCode == 13 && winPoint == true) {
            newGif();
        }
    });

    $(window).blur(function() {
        if(timerStart == true){
            loseGame();
        }
    });
});
