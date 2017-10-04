// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDKjlMvOjZAt9Fec-m4zzt4L3HK14bfSB0",
    authDomain: "kewl-project.firebaseapp.com",
    databaseURL: "https://kewl-project.firebaseio.com",
    projectId: "kewl-project",
    storageBucket: "kewl-project.appspot.com",
    messagingSenderId: "354534030430"
};
firebase.initializeApp(config);


var database = firebase.database();

// 2. Button for adding train
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainFirst = moment.unix($("#first-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding time and train data
    var newTrainz = {
        name: trainName,
        destination: trainDest,
        firsttrain: trainFirst,
        frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrainz);

    // Logs everything to console
    console.log(newTrainz.name);
    console.log(newTrainz.destination);
    console.log(newTrainz.firsttrain);
    console.log(newTrainz.frequency);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().firsttrain;
    var trainFrequency = childSnapshot.val().frequency;


    var firstTimeConverted = moment.unix(trainFirst, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var minutesAway = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var nextArrival = moment().add(minutesAway, "minutes").format('hh:mm a');
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));


    // Add each train's data into the table
    $("#time-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
        trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td><tr>");
});