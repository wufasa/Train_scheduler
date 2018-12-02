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
        frequency = $("#frequency").val().trim();
        message = document.getElementById("time-error");
        message.innerHTML = "";
        //make sure input values is valid
        try { 
            startTime = $("#startTime").val().trim();
            if(startTime == "") throw "empty";
            startTime = startTime.split(":");
            for(i=0;i<2;i++){
                if(isNaN(startTime[i])) throw "not a valid number";
                if(startTime[i].length > 2) throw "not a valid value";
                startTime[i] = parseInt(startTime[i]);
            }
            if(startTime[0] >= 24) throw "not a valid number";
            if(startTime[1] > 60) throw "not a valid number";
            if(isNaN(frequency)) throw "undefined frequency";
            database.ref().push({
            name: name,
            destination: destination,
            startTime: startTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        }
        catch(err) {
            message.innerHTML = "Input is " + err;
        }
       

        
        // Code for handling the push


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
        var ampm = "AM";
        // Change the HTML to reflect
        var curH = parseInt(moment().format("h")); 
        var curMM = parseInt(moment().format("mm"));
        var a = moment().format("a");

        if (a == "pm"){
            curH = curH + 12;
        }
        //start time = hh:mm military format
        var startH = sv.startTime[0]
        var startMM = sv.startTime[1] 
        var nextTrainTime = -1;
        var freq = parseInt(sv.frequency);
        var startT = (startH * 60) + startMM; //Convert to only minutes
        var curT = (curH * 60) + curMM;
        while (nextTrainTime < 0){
            if(startT - curT >= 0){
                nextTrainTime = startT - curT;
            }else{
                startT = startT + freq;
            }

        }
        nextTrainTimeH = Math.floor(startT/60) % 24;
        console.log(nextTrainTimeH);
        if(nextTrainTimeH > 11){ //Change to PM
            nextTrainTimeH = nextTrainTimeH - 12;
            console.log("nextTrainh: " + nextTrainTimeH);
            var ampm = "PM";
        }
        nextTrainTimeMM = startT % 60; //edge case
        if (nextTrainTimeMM == 0){
            nextTrainTimeMM = "00";
        }
        var row = $("<tr>");
        row.append($("<td>" + sv.name + "</td>"));
        row.append($("<td>" + sv.destination + "</td>"));
        row.append($("<td>" + sv.frequency + "</td>"));
        row.append($("<td>" + nextTrainTimeH + ":" + nextTrainTimeMM + ampm + "</td>"));
        row.append($("<td>" + nextTrainTime + "</td>"));
        $(".table-body").append(row);

        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
})