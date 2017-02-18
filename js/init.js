var count=20;
var counter=setInterval(timer, 1000);
var timerStart;

function closeIntro() {
    $("#intro").hide();
    $(".game").css("opacity","1");
}

function activeTimer(){
    timerStart = true;
    count = 20;
}

function timer(){
    if(timerStart == true){
        count=count-1;
        console.log(count);
        if (count <= 0){
            clearInterval(counter);
            return; 
        }
    }
}

jQuery(function($) {
    $( "#answer" ).keyup(function() {
        var lowercaseVal = $(this).val().toLocaleLowerCase();
        if(lowercaseVal == 'sanic'){
            console.log('WIN WIN WIN');
        }
    });
});