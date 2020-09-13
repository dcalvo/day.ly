const fs = require("fs");
const path = require("path");

async function writeToFile(assignments, fileName) {
  const filePath = path.join(__dirname, fileName);
  var json = JSON.stringify(assignments);
  fs.writeFile(filePath, json, (err) => {
    if (err) throw err;
  });
}

exports.writeToFile = writeToFile;
