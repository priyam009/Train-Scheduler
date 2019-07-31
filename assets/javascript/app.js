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

  $(".train-form").trigger("reset");

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  });
});

var count = 0;

database.ref().on("child_added", function(snapAdded) {
  updateTable(snapAdded);
});

function updateTable(snapshot) {
  var firstTrainTime = moment(snapshot.val().firstTrainTime, "HH:mm").subtract(
    1,
    "years"
  );

  var timeDiff = moment().diff(moment(firstTrainTime), "minutes");

  var minutesAway =
    snapshot.val().frequency - (timeDiff % snapshot.val().frequency);

  var nextTrain = moment()
    .add(minutesAway, "m")
    .format("HH:mm");

  var trow = $("<tr>");
  trow.attr("id", snapshot.key + "row");
  var tdata1 = $("<td>" + snapshot.val().trainName + "</td>");
  var tdata2 = $("<td>" + snapshot.val().destination + "</td>");
  var tdata3 = $("<td>" + snapshot.val().frequency + "</td>");
  var tdata4 = $("<td>" + nextTrain + "</td>");
  tdata4.addClass(snapshot.key + "nextTrain");
  var tdata5 = $("<td>" + minutesAway + "</td>");
  tdata5.addClass(snapshot.key + "minutesAway");
  var tdata6 = $("<td>");
  var input = $('<input type="checkbox">');
  input.attr("id", snapshot.key);
  tdata6.append(input);

  trow.append(tdata1, tdata2, tdata3, tdata4, tdata5, tdata6);
  $("#add-train").append(trow);

  count++;
}

$(document).on("click", ".remove-button", function() {
  database.ref().once("value", function(snap1) {
    for (var key in snap1.val()) {
      if ($("#" + key + ":checked").val()) {
        database
          .ref()
          .child(key)
          .remove();
        $("#" + key + "row").remove();
      }
    }
  });
});

setInterval(function() {
  if (moment().format("ss") == 0) {
    database.ref().once("value", function(snap) {
      snap.forEach(function(childsnap) {
        var firstTrainTime = moment(
          childsnap.val().firstTrainTime,
          "HH:mm"
        ).subtract(1, "years");

        var timeDiff = moment().diff(moment(firstTrainTime), "minutes");

        var minutesAway =
          childsnap.val().frequency - (timeDiff % childsnap.val().frequency);

        var nextTrain = moment()
          .add(minutesAway, "m")
          .format("HH:mm");

        $("." + childsnap.key + "nextTrain").text(nextTrain);
        $("." + childsnap.key + "minutesAway").text(minutesAway);
      });
    });
  }
}, 1000);
