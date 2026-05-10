const fs = require('fs');
const pdfParse = require('pdf-parse');

let dataBuffer = fs.readFileSync('d:\\ODOO\\Traveloop.pdf');

// Handle if it's default export
const parseFunc = typeof pdfParse === 'function' ? pdfParse : pdfParse.default || pdfParse.pdf;

parseFunc(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(function(error){
    console.error(error);
});
