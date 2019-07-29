// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBPBuCqj1i5Cb6dmA5ueSIuJxofTWM3_Kg",
  authDomain: "train-scheduler-8440a.firebaseapp.com",
  databaseURL: "https://train-scheduler-8440a.firebaseio.com",
  projectId: "train-scheduler-8440a",
  storageBucket: "",
  messagingSenderId: "105844030679",
  appId: "1:105844030679:web:18bca133fe6bd04d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#submit-button").on("click", function() {
  event.preventDefault();


  var trainName = $("#trainName")
    .val()
    .trim();
  var destination = $("#destination")
    .val()
    .trim();
  var firstTrainTime = $("#firstTrainTime")
    .val()
    .trim();
  var frequency = $("#frequency")
    .val()
    .trim();

  var addTrain = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  };

  $(".train-form").trigger("reset");

  console.log("addTrain", addTrain);

  database.ref().push({
    trainName : trainName,
    destination : destination,
    firstTrainTime : firstTrainTime,
    frequency : frequency
  });
});

database.ref().on("child_added", function(snapshot) {

  var firstTrainTime = moment(snapshot.val().firstTrainTime, 'HH:mm').subtract(1, 'years');
  
  var timeDiff = moment().diff(moment(firstTrainTime), 'minutes');

  var minutesAway = snapshot.val().frequency - (timeDiff % snapshot.val().frequency);

  var nextTrain = moment().add(minutesAway, 'm').format('hh:mm a');
  
  var trow = $("<tr>");
  var tdata1 = $("<th>" + snapshot.val().trainName + "</th>");
  var tdata2 = $("<td>" + snapshot.val().destination + "</td>");
  var tdata3 = $("<td>" + snapshot.val().frequency + "</td>");
  var tdata4 = $("<td>" + nextTrain + "</td>");
  var tdata5 = $("<td>" + minutesAway + "</td>");

  trow.append(tdata1, tdata2, tdata3, tdata4, tdata5);
  $("#add-train").append(trow);
});

