"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const controller_1 = require("./controller/controller");
const path = require("path");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const upload = multer();
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.post('/analyse', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file)
        return res.json({ err: 'could not receive file' });
    const extension = file.originalname?.split('.').pop();
    if (extension !== 'c')
        return res.json({ err: 'file needs to have a .c extension' });
    const content = Buffer.from(file.buffer).toString('utf-8');
    try {
        const result = await (0, controller_1.getLexicalAnalysis)(content);
        if (result.err) {
            return res.json({ err: result.err });
        }
        const [tokenList, symbolTable] = result.result;
        res.json({ tokenList, symbolTable });
    }
    catch (err) {
        console.log(err);
        res.json({ err: 'erro interno no servidor' });
    }
});
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
