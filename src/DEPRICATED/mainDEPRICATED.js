//DEPRICATED

const { tokenize, idTable } = require('./tokenizeDEPRICATED.js');
const fs = require('node:fs');



function tokenizeFile(file_address){
  try{
    const file = fs.readFileSync(file_address);
    const tokenList = tokenize(file.toString());
    return { data: stringfyTokenList(tokenList, idTable) }
  }catch(err){
    return { err: err };
  }
  
  /*  DEPRICATED
  return new Promise(readFile(file_address, (err, data) => {
  if(err) {
    return { err: err };
  }

  const tokenList = tokenize(data);

  return { data: stringfyTokenList(tokenList, idTable) };
}));
*/
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