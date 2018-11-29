// Initialize Firebase
$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyD89edPTjLGdRRPViQiVtJf9VeO0e5WYYE",
    authDomain: "train-scheduler-ad862.firebaseapp.com",
    databaseURL: "https://train-scheduler-ad862.firebaseio.com",
    projectId: "train-scheduler-ad862",
    storageBucket: "",
    messagingSenderId: "179598368852"
  };
  firebase.initializeApp(config);
    // Create a variable to reference the database.
    var database = firebase.database();
    
    //Add train
    $(".submit").on("click", function(event) {
      event.preventDefault();

      // Grabbed values from text boxes
      name = $("#name").val().trim();
      destination = $("#destination").val().trim();
      startTime = $("#startTime").val().trim();
      frequency = $("#frequency").val().trim();

      // Code for handling the push
      database.ref().push({
        name: name,
        destination: destination,
        startTime: startTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
        
    $("#name").text("");
    $("#destination").text("");
    $("#startTime").text("");
    $("#frequency").text("");


    });

    
    //push 
    //Append to schedule
    
    database.ref().on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
        // Change the HTML to reflect
        var curH = parseInt(moment().format("h")); 
        var curMM = parseInt(moment().format("mm"));
        var a = moment().format("a");

        if (a == "pm"){
            curH = curH + 12;
        }
        //start time = hh:mm military format
        var startH = sv.startTime.slice(0,2);
        var startMM = sv.startTime.slice(3,5);
        var nextTrainTime = -1;
        var freq = parseInt(sv.frequency);
//        while (nextTrainTime < 0){
//            if(startH - curH >= 0){
//                nextTrainTimeH = startH - curhH;
//                if(startMM - curMM > 0){
//                    nextTrainTimeMM = startMM - curMM;
//                    nextTrainTime = 1;
//                }
//                else{
//                    if(startMM += freq >= 60){
//                       startH += Math.floor((startMM + freq)/60)
//                       }
//                    else{
//                        startMM += freq;
//                    }
//                    
//                }
//            }
//            else{
//                startH += 1;
//            }
//            
//            
        }
        var minAway = nextTrainTimeH * 60 + nextTrainTimeMM;
        var row = $("<tr>");
        row.append($("<td>" + sv.name + "</td>"));
        row.append($("<td>" + sv.destination + "</td>"));
        row.append($("<td>" + sv.frequency + "</td>"));
        row.append($("<td>" + nextTrainTimeH + ":" + nextTrainTimeMM + "</td>"));
        row.append($("<td>") + minAway + "</td>");
        $(".table-body").append(row);

        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
})