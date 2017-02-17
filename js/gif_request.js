var apiKey = "&api_key=dc6zaTOxFJmzC"
var domain = "https://api.giphy.com/v1/gifs/search?q="
var request = new XMLHttpRequest;


var data;

function getGifs(){
  var gifsHtml = '';
	
	var query = domain + 'mario' + "&limit=" + 4 + apiKey;
	console.log(query);

	
	request.open ('GET', query, true);

	request.onload = function(){
		if(request.status >= 200 && request.status < 400){
			data = JSON.parse(request.responseText);
			console.log(data);
			for(var i = 0; i < data.data.length; i++){
                
				gifsHtml += '<img class="gif" src = ' + data.data[i].images.original.url +' "title="gif by Giphy">';
			}
			//console.log(gifsHtml);
			document.getElementById("GifContainer").innerHTML = gifsHtml;
		} else {
			alert('Conexão ao Giphy estabelecida, mas não foi possível enviar o pedido');
		}
	};

	request.oneerror = function() {
		alert('connection error');
	};
	request.send();
}    