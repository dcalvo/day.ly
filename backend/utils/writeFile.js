const fs = require("fs");

function writeToFile(assignments, fileName){
  var json = JSON.stringify(assignments);
  fs.writeFile(fileName,json, (err) => {

    if(err) throw err;

  });
}

exports.writeToFile = writeToFile;
