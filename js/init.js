var count=20;
var counter=setInterval(timer, 1000);
var timerStart;
var points=0;
var winPoint=false;

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
        console.log(count);
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
    winPoint = true;
}

$(document).keypress(function(e) {
    if(e.which == 13 && winPoint == true) {
        winPoint == false;
        newGif();
    }
});

function loseGame(){
    $(".overlay__lose").show();
    $(".overlay__lose").css({"opacity":"1","z-index":"9999"});
    $("input").prop('disabled', true);
    $(".lose-result").append('<h4><span class="title-note-big">' + answer_key + '</span> was the word.</h4>');
    var rand_lose_message = message_lose[Math.floor(Math.random() * message_lose.length)];
    $(".lose-message").append('' + rand_lose_message + '');
    timerStart = false;
}

function clearWinOverlay(){
    $(".lose-result").empty();
    $(".win-message").empty();
    $(".lose-message").empty();
    $(".scoreboard__value").empty();
}

function newGif(){
    $(".gif__image").remove();
    $("input").prop('disabled', false).val('').focus();
    $(".overlay").hide();
    $(".scoreboard__value").append('' + points + '');
    clearWinOverlay();
    activeTimer();
    getGifs();
}


jQuery(function($) {
    
    $(document).ready(function() {
        $(".overlay").hide();
    });
    
    $( "#answer" ).keyup(function() {
        var lowercaseVal = $(this).val().toLocaleLowerCase();
        if(lowercaseVal == answer_key){
            console.log('WIN WIN WIN');
            winGame();
        }
    });
});