var APIKEY = "&api_key=78Mcv2DxKGKWc"
var DOMAIN = "https://api.giphy.com/v1/gifs/search?q="
var request = new XMLHttpRequest;
var data;
var answer_key;

function getGifs(){
    var gifsHtml = '';
    var gifsLink = '';
	var randomValue = Math.floor((Math.random() * 10) + 1);
    
    var num = Math.floor(Math.random() * keys.length);
    
    answer_key = keys[num];
    
	var query = DOMAIN + answer_key + "&limit=" + 4 + "&offset=" + randomValue + APIKEY;

	
	request.open ('GET', query, true);

	request.onload = function(){
		if(request.status >= 200 && request.status < 400){
			data = JSON.parse(request.responseText);
			for(var i = 0; i < data.data.length; i++){
                
                gifsLink = data.data[i].images.original.url 
                if( $( ".button1x4" ).hasClass( "scoreboard__button--show" ) ){
                    gifsHtml += '<div class="gif__image gif__image--line gif__image-' + (i+1) + '" style="background-image: url('+ gifsLink +');"></div>';
                }
                else{
                   gifsHtml += '<div class="gif__image gif__image-' + (i+1) + '" style="background-image: url('+ gifsLink +');"></div>'; 
                }
			}
            $("#gif__container").append(gifsHtml);
                
		} else {
			alert('Oh my GIF! Something bad happened...');
		}
	};

	request.oneerror = function() {
		alert('connection error');
	};
	request.send();
    
    
    var name = keys.splice(num,1);
    keys.push(name);
}    

function randomGif(){
    request = new XMLHttpRequest();
	request.open('GET', "https://api.giphy.com/v1/gifs/random?api_key=78Mcv2DxKGKWc&tag=game", true);

	request.onload = function(){
		if(request.status >= 200 && request.status < 400){
			gifURL= JSON.parse(request.responseText).data.image_url;
			document.getElementById("intro-background").src = gifURL;
		} else {
			alert('Oh my GIF! Something bad happened...');
		}
	};

	request.oneerror = function() {
		alert('connection error');
	};
	request.send();
}