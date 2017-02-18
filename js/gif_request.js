var apiKey = "&api_key=dc6zaTOxFJmzC"
var domain = "https://api.giphy.com/v1/gifs/search?q="
var request = new XMLHttpRequest;
var answer_key = "apple";

var data;

function getGifs(){
    var gifsHtml = '';
    var gifsLink = '';
	var randomValue = Math.floor((Math.random() * 25) + 1);
    console.log(randomValue);
    
	var query = domain + answer_key + "&limit=" + 4 + "&offset=" + randomValue + apiKey;

	
	request.open ('GET', query, true);

	request.onload = function(){
		if(request.status >= 200 && request.status < 400){
			data = JSON.parse(request.responseText);
			console.log(data);
			for(var i = 0; i < data.data.length; i++){
                
                gifsLink = data.data[i].images.original.url 
                gifsHtml += '<div class="gif__image" style="background-image: url('+ gifsLink +');"></div>';
			}
			//console.log(gifsHtml);
			document.getElementById("gif__container").innerHTML = gifsHtml;
		} else {
			alert('Oh my GIF! Something bad happened...');
		}
	};

	request.oneerror = function() {
		alert('connection error');
	};
	request.send();
}    

function randomGif(){
    request = new XMLHttpRequest();
	request.open('GET', "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=game", true);

	request.onload = function(){
		if(request.status >= 200 && request.status < 400){
			gifURL= JSON.parse(request.responseText).data.image_url;
			console.log(gifURL);
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