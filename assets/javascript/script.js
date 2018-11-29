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

    });

    
    //push 
    //Append to schedule
    
    database.ref().on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
        // Change the HTML to reflect
        var row = $("<tr>");
        row.append($("<td>" + sv.name + "</td>"));
        row.append($("<td>" + sv.destination + "</td>"));
        row.append($("<td>" + sv.frequency + "</td>"));
        //append months worked, output 1992-03-21
        //append Next arrival and minutes away using moment.js
        //append total billed
        //        var totalBill = monthlyRate * monthsWorked;
        //        row.append($("<td>" + totalBill  + "</td>"))
        $(".table-body").append(row);

        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
})