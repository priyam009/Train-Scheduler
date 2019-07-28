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

  console.log(snapshot.val().trainName);

  var currentTime = moment().format('HH:MM');
  // var firstTrainTime = moment(snapshot.val().firstTrainTime, 'HH:MM'); 
  var firstTrainTime = moment(snapshot.val().firstTrainTime, 'HH:MM');

  console.log("currentTime", currentTime);
  console.log("firstTrainTime", firstTrainTime);

  // var timeDiff = currentTime.diff(firstTrainTime, 'minutes');
  // console.log("timeDiff", timeDiff);

  var trow = $("<tr>");
  var tdata1 = $("<th>" + snapshot.val().trainName + "</th>");
  var tdata2 = $("<td>" + snapshot.val().destination + "</td>");
  var tdata3 = $("<td>" + snapshot.val().frequency + "</td>");
  var tdata4 = $("<td>" + snapshot.val().frequency + "</td>");
  var tdata5 = $("<td>" + snapshot.val().frequency + "</td>");

  trow.append(tdata1, tdata2, tdata3, tdata4, tdata5);
  $("#add-train").append(trow);
});

/* <tr>
<td>1</td>
<td>Mark</td>
<td>Otto</td>
<td>@mdo</td>
<td>@mdo</td>
</tr> */
