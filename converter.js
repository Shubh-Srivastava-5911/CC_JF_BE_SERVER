// json secret file to single string file converter

const fs = require('fs');

const json = require('./services/firebase/servicesec.json');
const minified = JSON.stringify(json);

fs.writeFileSync('service-account.json.min', minified);
console.log('File successfully minified to service-account.json.min');
