// const { Parser } = require('json2csv');

const { createReadStream, createWriteStream } = require('fs');
const { Transform } = require('json2csv');
 

// const fields = ['car','price','color'];

//   const json2csvParser = new Parser({ fields });
//   const csv = json2csvParser.parse(myCars);
   
const { AsyncParser } = require('json2csv');

function generate_csv(fields,data,pathoutput,cb) {
  const opts = { fields };
  const transformOpts = { highWaterMark: 8192 };
  
  const asyncParser = new AsyncParser(opts, transformOpts);
  const outputPath = pathoutput+Date.now()+".csv" ;

  let csv = '';
  asyncParser.processor
    .on('data', chunk => (csv += chunk.toString()))
    .on('end', () => console.log(csv))
    .on('error', err => console.error(err));
    
  // You can also listen for events on the conversion and see how the header or the lines are coming out.
  asyncParser.transform
    .on('header', header => console.log(header))
    .on('line', line => console.log(line))
    .on('error', err => console.log(err));

  asyncParser.input.push(JSON.stringify(data)); // This data might come from an HTTP request, etc.
  asyncParser.input.push(null); // Sending `null` to a stream signal that no more data is expected and ends it.
  
  const output = createWriteStream(outputPath, { encoding: 'utf8' });

  asyncParser.toOutput(output).promise()
    .then(csv=>cb(outputPath))
    .catch(err=>console.log(err))
    // console.log(csv);

}

module.exports = generate_csv;