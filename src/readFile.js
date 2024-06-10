
const fs = require('node:fs');

function readFile(fileName, callback){
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    console.log(data.length)
    return callback(null, data);
  });
}

module.exports = {
  readFile,
}