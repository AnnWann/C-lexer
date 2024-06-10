const { tokenize, idTable } = require('./tokenize.js');
const { readFile } = require('./readFile.js');


const fileName = process.argv.at(2);

readFile(fileName, (err, data) => {
  if(err) {
    console.error(err);
    return;
  }

  const tokenList = tokenize(data);

  console.log("Token list:\n");
  tokenList.forEach((val) => console.log(val));
  console.log("Identifier table:\n");
  idTable.forEach((val, key) => console.log(`{\n  key: ${key},\n  val: ${val}\n}`));
});

