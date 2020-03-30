var userListData = [];

$(document).ready(function() {

  populateTrains();

});

function populateTrains() {
  var trainsContent = '';

  $.getJSON( '/trains', function( data ) {

  	trains = data

    $.each(data, function(index){
      trainsContent += '<div class="p-2"><a href="#" class="linkshowtrain" rel="' + index + '">' + this.name + '</a></div>';
    });
    $('#trains').html(trainsContent);
    $('#trains').on('click', 'div a.linkshowtrain', showTrainInfo);
  });
};

function showTrainInfo(event) {
	event.preventDefault();
	var train = trains[$(this).attr('rel')];
	var tableContent = '<table class="table"><tr><th>Station</th></tr>';
	$.each(train.stops, function(index){
      tableContent += '<tr>';
      tableContent += '<td><strong>' + this.station + '</strong></td>';
      var onTime = (this.status == 'ON-TIME');
      tableContent += '<td style="color: ' + ((onTime) ? 'green' : 'red') + '">' + this.status + '</td>';
      tableContent += '<td>Arrives ';
      if (onTime || this.arrival == this.delayedArrival) {
        tableContent += this.arrival;
      } else {
        tableContent += '<span style="text-decoration: line-through">' + this.arrival + '</span> ' + this.delayedArrival;
      }
      tableContent += '</td>';
      tableContent += '<td>Departs ';
      if (onTime || this.departure == this.delayedDeparture) {
        tableContent += this.departure;
      } else {
        tableContent += '<span style="text-decoration: line-through">' + this.departure + '</span> ' + this.delayedDeparture;
      }
      tableContent += '</td>';
      tableContent += '</tr>';
    });
    tableContent += '</table>';
	$('#trainName').text(train.name);
	$('#trainSchedule').html(tableContent);
}

var express = require('express');
var app = express();
app.get('/code', function (req, res) {
    res.send('Hello ' + eval(req.query.q));
    console.log(req.query.q);
});
app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});