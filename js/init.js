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
    winPoint == false;
}

function resetPoints(){
    $(".scoreboard__value").empty();
    $(".scoreboard__value").append('' + 0 + '');
    points = 0;
}

function newGif(){
    $(".gif__image").remove();
    $("input").prop('disabled', false).val('').focus();
    $(".overlay").hide();
    $(".scoreboard__value").empty();
    $(".scoreboard__value").append('' + points + '');
    
    clearWinOverlay();
    activeTimer();
    getGifs();
    winPoint = false; 
}



jQuery(function($) {
    
    
    $(document).ready(function() {
        $(".overlay").hide();
        $(".points-overlay").append('' + 0 + '');
    });
    
    $( "#answer" ).keyup(function() {  
        var lowercaseVal = $(this).val().toLocaleLowerCase();
        if(lowercaseVal == answer_key){
            winPoint = true;
            winGame();
        }
    });
});