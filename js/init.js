var count = 20;
var counter = setInterval(timer, 1000);
var timerStart;
var points = 0;
var winPoint = false;
var imgLoaded = 0;


function closeIntro() {
    $("#intro").hide();
    $(".game").css("opacity","1");
}

function init(){
    $(".overlay").hide();
}

function activeTimer(){
    timerStart = true;
    count = 21;
}

function timer(){
    if(timerStart == true){
        count=count-1;
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
    points++;
    $(".points-overlay").empty();
    $(".points-overlay").append('' + points + '');
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

$(document).keypress(function(e) {
    if(e.which == 13 && winPoint == true) {
        newGif();
    }
});

$(window).blur(function() {
    if(timerStart == true){
        loseGame();
    }    
});

function loseGame(){
    $(".overlay__lose").show();
    $(".overlay__lose").css({"opacity":"1","z-index":"9999"});
    $("#answer").prop('disabled', true);
    $(".lose-result").append('<h4><span class="title-note-big">' + answer_key + '</span> was the word.</h4>');
    var rand_lose_message = message_lose[Math.floor(Math.random() * message_lose.length)];
    $(".lose-message").append('' + rand_lose_message + '');
    timerStart = false;
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
    winPoint == false;
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
    $("input").prop('disabled', false).val('').focus();
    $(".overlay").hide();
    $(".scoreboard__value").empty();
    $(".scoreboard__value").append('' + points + '');
    $(".play-again-js").addClass("hide");
    clearWinOverlay();
    getGifs();
    imgLoaded = 0;
    winPoint = false; 
}

function loadGif(){
    $(".gif__image").ready(function(){
        activeTimer();
    });
}

function loadFunc(){
    console.log("something");
    imgLoaded++;
    if(imgLoaded == 4){
        activeTimer();
        $('.gif__image-loader').addClass('gif__image--loaded');
    }
    console.log(imgLoaded);
}


jQuery(function($) {
    
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $(".intro-hide-mobile").addClass("hide");
        $(".intro-display-mobile").addClass("show");
    }
    
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
    
    $("#intro").ready(function(){
        $(".intro__overlay").addClass("intro__overlay--disable");
    });
    
    $( "#answer" ).keyup(function() {  
        var lowercaseVal = $(this).val().toLocaleLowerCase();
        if(lowercaseVal == answer_key){
            winPoint = true;
            winGame();
        }
    });
});