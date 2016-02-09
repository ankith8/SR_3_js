const readline = require('readline');
const fs = require('fs');

var csv="WDI_Data_Demo.csv";
var JSONfile="WDI_Data_Demo.json";

fs.readFile(csv, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  csvTOJSON(data);
  //console.log(data);
});
//var csv is the CSV file with headers
function csvTOJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(";");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(";");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }

    // console.log(result);

    // Write the data to json file
    fs.writeFile(JSONfile, JSON.stringify(result), function (err) {
      if (err) return console.log(err);
      console.log('data saved!');
    });
}
