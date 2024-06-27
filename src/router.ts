import * as dotenv from 'dotenv';
import * as express from 'express';
import { Express } from 'express';
import { Multer } from 'multer';
import multer = require('multer');
import { getLexicalAnalysis } from './controller/controller';
import path = require('path');

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;
const upload: Multer = multer();



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); // Replace 'index.html' with your actual file name
});

app.post('/analyse', upload.single('file'), async (req, res) => {
  const file = req.file;
  
  if(!file) res.json( {err: 'could not receive file'});

  const isNotCFile = file.filename.split('.').pop() !== '.c'
  if( isNotCFile ) res.json( {err: 'file needs to have a .c extension'});
  
  const result = await getLexicalAnalysis(file.path);
  const err = result.err;
  const [tokenList, symbolTable] = result.result;
  
  res.json( err ? { err } : { tokenList, symbolTable });
});


app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});