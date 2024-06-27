"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSHA256Hash = createSHA256Hash;
const crypto_1 = require("crypto");
function createSHA256Hash(inputString) {
    const hash = (0, crypto_1.createHash)('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}
