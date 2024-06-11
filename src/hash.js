const crypto = require("crypto");

function createSHA256Hash(inputString) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex');
}

module.exports = createSHA256Hash;