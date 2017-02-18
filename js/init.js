var count=20;
var counter=setInterval(timer, 1000);
var timerStart;

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
            clearInterval(counter);
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
}

function loseGame(){
    $(".overlay__lose").show();
    $(".overlay__lose").css({"opacity":"1","z-index":"9999"});
    $("input").prop('disabled', true);
    timerStart = false;
}

function newGif(){
    $(".gif__image").remove();
    $("input").prop('disabled', false).val('').focus();
    $(".overlay").hide();
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