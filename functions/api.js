
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
const TrainEndpoint = require('../api/indianrail/setup');
const FirebaseEndpoint = require("../services/firebase/setup");

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
router.use(cors()); // Enable CORS for all routes

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

router.get('/jf/info/direct_routes/:loc', (request, response) => {
    FlightEndpoint.getDirectRoutes(request.params.loc).then((res) => {
        response.send(res);
    })
    .catch((error) => {
        throw error;
    });
});
router.get('/jf/info/get_nearest_airports/:lat/:lon', (request, response) => {
    FlightEndpoint.getNearestAirports(request.params.lat, request.params.lon).then((res) => {
        response.send(res);
    })
    .catch((error) => {
        throw error;
    });
});
router.get('/jf/info/get_nearest_city_airports/:cityName/:stateCode', (request, response) => {
    CitiesEndpoint.getLatLonOfCity(request.params.cityName, request.params.stateCode)
    .then((res) => {
        return FlightEndpoint.getNearestAirports(res.lat, res.lon);
    })
    .then((res) => {
        return response.json(res);
    })
    .catch((error) => {
        throw error;
    });
});
router.get('/jf/info/get_city_airports/:cityName', (request, response) => {
    FlightEndpoint.getCityAirports(request.params.cityName).then((res) => {
        response.send(res);
    })
    .catch((error) => {
        throw error;
    });
});
// router.options('/jf/info/get_states_of_india', (request, response) => {
//     response.set('Access-Control-Allow-Origin', '*');
//     response.set('Access-Control-Allow-Methods', 'GET, OPTIONS');  // Allow OPTIONS and GET methods
//     response.set('Access-Control-Allow-Headers', 'Content-Type');  // Allow Content-Type header
//     response.status(200).send();  // Respond with a 200 status code for OPTIONS request
// });
router.get('/jf/info/get_states_of_india', (request, response) => {
    CitiesEndpoint.getStatesOfIndia().then((res) => {
        // response.set('Access-Control-Allow-Origin', '*');  // Allow all origins (or specify your Wix domain instead of '')
        // response.set('Access-Control-Allow-Methods', 'GET');  // Allow GET requests
        // response.set('Access-Control-Allow-Headers', 'Content-Type');  // Allow Content-Type header
        
        response.json(res);  // Send the response as JSON
        // response.send(res);
    })
    .catch((error) => {
        throw error;
    });
});
router.get('/jf/info/get_cities_of_state/:stateCode', (request, response) => {
    CitiesEndpoint.getCitiesOfState(request.params.stateCode).then((res) => {
        response.json(res);
    })
    .catch((error) => {
        throw error;
    });
});
router.get('/jf/info/get_lat_lon_of_city/:cityName/:stateCode', (request, response) => {
    CitiesEndpoint.getLatLonOfCity(request.params.cityName, request.params.stateCode).then((res) => {
        response.json(res);
    })
    .catch((error) => {
        throw error;
    });
});
router.get('/jf/info/get_routes_between/:srcCityName/:srcStateCode/:dstCityName/:dstStateCode', (request, response) => {
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
        throw error;
    });
});
router.get('/jf/info/get_flights_between/:srcArptCode/:dstArptCode/:startDate', (request, response) => {
    FlightEndpoint.getFlightsBetween(request.params.srcArptCode, request.params.dstArptCode, request.params.startDate)
    .then((res) => {
        response.json(res);
    })
    .catch((error) => {
        throw error;
    });
});
router.get('/jf/info/get_trains_between/:trainNum/:startDate', (request, response) => {
    TrainEndpoint.getTrainsBetween(request.params.trainNum, request.params.startDate)
    .then((res) => {
        console.log(res)
        response.json(res);
    })
    .catch((error) => {
        throw error;
    })
});


router.get('/jf/info/jffb/get_journeys/:email', (request, response) => {
    FirebaseEndpoint.firestoreReadJourneys(request.params.email)
    .then((res) => {
        response.json(res);
    })
    .catch((error) => {
        throw error;
    })
});

router.get('/jf/info/jffb/put_journey/:email', (request, response) => {
    // const newJourney = {
    //     name: 'My New Journey',
    //     startDate: '2024-12-04',
    //     destination: 'Goa',
    //     notes: 'Remember to pack sunscreen!'
    // };
    // http://localhost:3000/.netlify/functions/api//jf/info/jffb/put_journey/testuser@journeyflow.com
    FirebaseEndpoint.firestorePutJourney(request.params.email, JSON.parse(request.body))
    .then((res) => {
        response.json(res);
    })
    .catch((error) => {
        throw error;
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
