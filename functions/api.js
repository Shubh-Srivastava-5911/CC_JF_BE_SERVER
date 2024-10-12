
/*
    Aspect	        this	                                    globalThis	                            module
    ----------------------------------------------------------------------------------------------------------------------------------------
    Context	        Refers to current context	                Global object (Node: global)	        Represents the current module
    Global Scope	{} in Node.js (non-strict)	                Refers to global in Node.js	            Contains module metadata
    Inside Module	Can refer to the object method context	    Always refers to the global object	    Defines module exports
    Use Case	    Context-sensitive execution	                Access global scope	                    Manage exports and module info

    available builtin modules provided by nodeJS, use them as require('_module_name_')
    * path  -  direct functions to use
    * os  -  direct functions to use
    * events  -  class, need to create object first
    * fs  -  direct functions to use
    * http  -  direct functions to use
*/

const strings = require('../res/string/string_res');
const logger = require('../util/logger');
const FlightEndpoint = require('../api/amadeus/setup');

const http_module = require('http');
const express = require('express');
const serverless = require('serverless-http');

const appex = express();
const router = express.Router();

/*********************************************************************************************************************************************/

logger.log('check');

// const server = http_module.createServer((request, response) => {
//     response.write('you are connected with journey flow app server\n');
//     if(request.url === '/') {
//         response.write('home');
//         response.end();
//     }
//     else if(request.url === '/data') {
//         response.write('data');
//         response.end();
//     }
//     else {
//         response.write('null');
//         response.end();
//     }
// });
// server.listen('3000');

// appex.listen('3000');
appex.use('/.netlify/functions/api', router);

router.get('/', (request, response) => {
    response.send('you are connected with journey flow backend server\n');
});
router.get('/person', (request, response) => {
    response.send('this is person route\n');
});
router.get('/person/:name/:age', (request, response) => {
    console.log(request.params);
    response.send({
        params: request.params,
        query: request.query
    });
});

router.get('/info/flight/direct_routes/:loc', (request, response) => {
    FlightEndpoint.getDirectRoutes(request.params.loc).then((res) => {
        response.send(res);
    })
});

module.exports = {
    handler : serverless(appex)
}