$(function () {
    var LEADERBOARD_SIZE = 5;
  
    // Build some firebase references.
    var rootRef = new Firebase("https://word-4-gifs.firebaseio.com/leaderboard");
    var scoreListRef = rootRef.child("scoreList");
    var highestScoreRef = rootRef.child("highestScore");

    // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
    var htmlForPath = {};

    // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
    function handleScoreAdded(scoreSnapshot, prevScoreName) {
        var newScoreRow = $("<tr/>");
        newScoreRow.append($("<td/>").text(scoreSnapshot.val().name));
        newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

        // Store a reference to the table row so we can get it again later.
        htmlForPath[scoreSnapshot.key()] = newScoreRow;

        // Insert the new score in the appropriate place in the table.
        if (prevScoreName === null) {
          $("#leaderboardTable").append(newScoreRow);
        }
        else {
          var lowerScoreRow = htmlForPath[prevScoreName];
          lowerScoreRow.before(newScoreRow);
        }
    }

    // Helper function to handle a score object being removed; just removes the corresponding table row.
    function handleScoreRemoved(scoreSnapshot) {
        var removedScoreRow = htmlForPath[scoreSnapshot.key()];
        removedScoreRow.remove();
        delete htmlForPath[scoreSnapshot.key()];
    }

    // Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
    var scoreListView = scoreListRef.limitToLast(LEADERBOARD_SIZE);

    // Add a callback to handle when a new score is added.
    scoreListView.on("child_added", function (newScoreSnapshot, prevScoreName) {
        handleScoreAdded(newScoreSnapshot, prevScoreName);
    });

    // Add a callback to handle when a score is removed
    scoreListView.on("child_removed", function (oldScoreSnapshot) {
        handleScoreRemoved(oldScoreSnapshot);
    });

    // Add a callback to handle when a score changes or moves positions.
    var changedCallback = function (scoreSnapshot, prevScoreName) {
        handleScoreRemoved(scoreSnapshot);
        handleScoreAdded(scoreSnapshot, prevScoreName);
    };
    scoreListView.on("child_moved", changedCallback);
    scoreListView.on("child_changed", changedCallback);

    // When the user presses enter on scoreInput, add the score, and update the highest score.
    $("#scoreSubmit").click(function() {
            var newScore = points;
            var name = $("#nameInput").val();

        if (name.length === 0)
            return;

        var userScoreRef = scoreListRef.child(name);

        // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
        userScoreRef.setWithPriority({ name:name, score:newScore }, newScore);

        // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
        // executed on the latest data from the server, so transactions should be used if you have multiple
        // clients writing to the same data and you want to avoid conflicting changes.
        highestScoreRef.transaction(function (currentHighestScore) {
            if (currentHighestScore === null || newScore > currentHighestScore) {
                // The return value of this function gets saved to the server as the new highest score.
                return newScore;
            }
            // if we return with no arguments, it cancels the transaction.
            return;
        });
        showLeaderboard();
    });
});
