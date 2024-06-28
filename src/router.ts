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
  res.sendFile(path.join(__dirname, '../public/index.html')); 
});

app.post('/analyse', upload.single('file'), async (req, res) => {
  
  const file = req.file;
  if(!file) return res.json( {err: 'could not receive file'});

  const extension = file.originalname?.split('.').pop();
  if( extension !== 'c' ) return res.json( {err: 'file needs to have a .c extension'});
  
  const result = await getLexicalAnalysis(file.originalname);
  
  if(result.err){
    return res.json( { err: result.err } );
  }

  const [tokenList, symbolTable] = result.result;
  
  res.json( { tokenList, symbolTable });
});


app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});