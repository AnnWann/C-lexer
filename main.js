const { readFile } = require('./readFile.js');

const fileName = process.argv.at(2);

readFile(fileName, (err, data) => {
  if(err) {
    console.error(err);
    return;
  }
  console.log(data);
});

