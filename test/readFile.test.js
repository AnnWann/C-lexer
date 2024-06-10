const { readFile } = require('../src/readFile');


test('read file to get data string', done => {
  function callback(err, data) {
    if(err){
      done(err);
      return;
    }
    try{
      expect(data).toBe('HELLO WORLD, I LOVE YOU.');
      done();
    } catch(err){
      done(err);
    }
  }

  readFile('./test/test.c', callback);
})