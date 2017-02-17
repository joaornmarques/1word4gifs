var apiKey = "&api_key=dc6zaTOxFJmzC"
var domain = "https://api.giphy.com/v1/gifs/search?q="
var request = new XMLHttpRequest;


var data;

function getGifs(){
    var gifsHtml = '';
    var gifsLink = '';
	
	var query = domain + 'nyan+cat' + "&limit=" + 4 + apiKey;
	console.log(query);

	
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