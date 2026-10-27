var APIKEY = "78Mcv2DxKGKWc";
var SEARCH_URL = "https://api.giphy.com/v1/gifs/search";
var adultMode = false;

// Adult mode (opt-in on the intro screen) adds the adult words and allows R-rated GIFs.
function currentRating(){
    return adultMode ? "r" : "pg-13";
}

function toggleAdultMode(){
    if (!adultMode && !confirm("Adult mode shows R-rated GIFs and adult words. Are you 18 or older?")) return;
    adultMode = !adultMode;
    used_words = {};
    $(".adult-toggle")
        .toggleClass("adult-toggle--on", adultMode)
        .text(adultMode ? "Adult mode: on (18+)" : "Adult mode: off");
}
var GIFS_PER_ROUND = 4;
var MAX_ATTEMPTS = 3;

var answer_key;
var current_word;
var used_words = {};

// Difficulty level of a word: 1 easy, 2 medium, 3 hard.
function wordLevel(word){
    var total = word.spell + word.know;
    if (total <= 3) return 1;
    if (total === 4) return 2;
    return 3;
}

// Chance of each level [easy, medium, hard] for the current score.
function levelWeights(score){
    if (score < 3)  return [1, 0, 0];
    if (score < 6)  return [0.6, 0.4, 0];
    if (score < 10) return [0.2, 0.6, 0.2];
    if (score < 15) return [0, 0.5, 0.5];
    return [0, 0.25, 0.75];
}

function rollLevel(weights){
    var r = Math.random();
    for (var i = 0; i < weights.length; i++){
        r -= weights[i];
        if (r < 0) return i + 1;
    }
    return weights.length;
}

function unusedWords(level){
    return WORDS.filter(function(word){
        if (word.adult && !adultMode) return false;
        return !used_words[word.w] && (!level || wordLevel(word) === level);
    });
}

// Picks a word not seen yet this session, close to the target level.
function pickWord(score){
    var target = rollLevel(levelWeights(score));
    var order = [target, target - 1, target + 1, target - 2, target + 2];
    for (var i = 0; i < order.length; i++){
        if (order[i] < 1 || order[i] > 3) continue;
        var pool = unusedWords(order[i]);
        if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
    }
    used_words = {};
    return pickWord(score);
}

function letterHint(word, showFirst){
    var size = word.length + " letters";
    if (!showFirst) return size;
    return "Starts with " + word.charAt(0).toUpperCase() + " · " + size;
}

function showHint(showFirst){
    if (!answer_key) return;
    $("#answer").attr("placeholder", letterHint(answer_key, showFirst));
}

function gifUrl(gif){
    var images = gif.images || {};
    var best = images.downsized_medium || images.original;
    return best && best.url;
}

function renderGifs(urls){
    var lineMode = $(".button1x4").hasClass("scoreboard__button--show");
    var gifsHtml = "";
    for (var i = 0; i < urls.length; i++){
        var classes = "gif__image" + (lineMode ? " gif__image--line" : "") + " gif__image-" + (i + 1);
        gifsHtml += '<div class="' + classes + '" style="background-image: url(' + urls[i] + ');">' +
            '<div class="gif__image-loader">' +
            '<img onload="loadFunc()" onerror="loadFunc()" class="gif-loader" src="' + urls[i] + '"/>' +
            '</div></div>';
    }
    $("#gif__container").append(gifsHtml);
}

function getGifs(attempt){
    attempt = attempt || 1;
    var word = pickWord(points);
    used_words[word.w] = true;

    var query = SEARCH_URL +
        "?q=" + encodeURIComponent(word.w) +
        "&limit=" + (GIFS_PER_ROUND * 2) +
        "&offset=" + Math.floor(Math.random() * 10) +
        "&rating=" + currentRating() +
        "&api_key=" + APIKEY;

    var request = new XMLHttpRequest();
    request.open("GET", query, true);

    request.onload = function(){
        if (request.status < 200 || request.status >= 400){
            alert("Oh my GIF! Something bad happened...");
            return;
        }
        var results = JSON.parse(request.responseText).data || [];
        var urls = results.map(gifUrl).filter(Boolean).slice(0, GIFS_PER_ROUND);

        // Not enough GIFs for this word: try another one instead of freezing the round.
        if (urls.length < GIFS_PER_ROUND){
            if (attempt < MAX_ATTEMPTS) return getGifs(attempt + 1);
            alert("Oh my GIF! Something bad happened...");
            return;
        }

        current_word = word;
        answer_key = word.w;
        showHint(false);
        renderGifs(urls);
    };

    request.onerror = function(){
        alert("Connection error");
    };

    request.send();
}

function randomGif(){
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.giphy.com/v1/gifs/random?api_key=" + APIKEY + "&tag=vaporwave&rating=pg-13", true);

    request.onload = function(){
        if (request.status >= 200 && request.status < 400){
            var gifURL = gifUrl(JSON.parse(request.responseText).data || {});
            if (gifURL) document.getElementById("intro-background").src = gifURL;
        }
    };

    request.send();
}
