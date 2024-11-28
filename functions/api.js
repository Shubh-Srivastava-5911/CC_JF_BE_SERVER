
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
const CitiesEndpoint = require('../api/geodb/setup');

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

appex.listen('3000');
appex.use('/.netlify/functions/api', router);
const cors = require('cors');
appex.use(cors()); // Enable CORS for all routes

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
router.get('/info/flight/get_nearest_airports/:lat/:lon', (request, response) => {
    FlightEndpoint.getNearestAirports(request.params.lat, request.params.lon).then((res) => {
        response.send(res);
    })
});
router.get('/info/flight/get_city_airports/:city', (request, response) => {
    FlightEndpoint.getCityAirports(request.params.city).then((res) => {
        response.send(res);
    })
});
router.get('/info/cities/get_states_of_india', (request, response) => {
    CitiesEndpoint.getStatesOfIndia().then((res) => {
        response.set('Access-Control-Allow-Origin', '');  // Allow all origins (or specify your Wix domain instead of '')
        response.set('Access-Control-Allow-Methods', 'GET');  // Allow GET requests
        response.set('Access-Control-Allow-Headers', 'Content-Type');  // Allow Content-Type header
        
        response.json(res);  // Send the response as JSON
        // response.send(res);
    })
});
router.get('/info/cities/get_cities_of_state/:stateCode', (request, response) => {
    CitiesEndpoint.getCitiesOfState(request.params.stateCode).then((res) => {
        response.send(res);
    })
});
router.get('/info/flight/get_routes_between/:srcCityName/:srcStateCode/:dstCityName/:dstStateCode', (request, response) => {
    let sLatLon, dLatLon;
    CitiesEndpoint.getLatLonOfCity(request.params.srcCityName, request.params.srcStateCode)
    .then((res) => {
        sLatLon = res;
        return CitiesEndpoint.getLatLonOfCity(request.params.dstCityName, request.params.dstStateCode);
    })
    .then((res) => {
        dLatLon = res;
        return FlightEndpoint.getRoutesBetween(sLatLon.lat, sLatLon.lon, dLatLon.lat, dLatLon.lon);
    })
    .then((res) => {
        response.send(res);
    })
    .catch((error) => {
        console.log(error);
    })
});

module.exports = {
    handler : serverless(appex)
}


/*
function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + (minutes / 60) + (seconds / 3600);
  if (direction === "S" || direction === "W") {
    dd = dd * -1;  // South and West are negative in coordinates
  }
  return dd;
}

// Example conversion for 30°12'52.5"N, 74°57'49.3"E
let latitude = convertDMSToDD(30, 12, 52.5, "N");
let longitude = convertDMSToDD(74, 57, 49.3, "E");
*/