const { tokenize, idTable } = require('./tokenize.js');
const { readFile } = require('./readFile.js');




function tokenizeFile(file_address){
  readFile(file_address, (err, data) => {
  if(err) {
    return { err: err };
  }

  const tokenList = tokenize(data);

  return { data: stringfyTokenList(tokenList, idTable) };
});
}

function stringfyTokenList(tokenList, idTable){
  return "Token list:\n"
  .concat(
      tokenList
      .map(token => `value: ${token.value}, type: ${token.type}`)
      .join("\n")
  )
  .concat("\n\nID table:\n")
  .concat(
    Array.from(idTable.entries())
   .reduce((acc, [key, value]) => acc + `[${key}] ${value}\n`, "")
  );
}

module.exports = tokenizeFile;