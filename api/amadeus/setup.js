// const axios = require('axios');
// const qs = require('qs'); // Used to stringify the request body
// const str = require('./string.json');

// const client_id = str.apiKey;
// const client_secret = str.apiSecret;

// // Define the data as x-www-form-urlencoded
// const data = qs.stringify({
//     grant_type: 'client_credentials',
//     client_id: client_id,
//     client_secret: client_secret
// });

// function use() {
//     // Send POST request to Amadeus API
//     axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', data, {
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     })
//     .then(response => {
//         console.log(response.data);  // The access token will be here
//     })
//     .catch(error => {
//         console.error('Error:', error.response ? error.response.data : error.message);
//     });
// }

const str = require('./string.json');

const Amadeus = require('amadeus');

module.exports = class FlightEndpoint {
    static apiInstance1 = null;

    static refreshInstance1() {
        this.apiInstance1 = new Amadeus({
            clientId: str.apiKey,
            clientSecret: str.apiSecret
        });
    }

    static getDirectRoutes(location) {
        this.refreshInstance1();
        return this.apiInstance1?.airport.directDestinations.get({
            departureAirportCode: location,
        }).then(function (response) {
            return response.data;
        }).catch(function (responseError) {
            return responseError.code;
        });
    }

    static getNearestAirports(latitude, longitude) {
        this.refreshInstance1();
        return this.apiInstance1?.referenceData.locations.airports.get({
            longitude: longitude,
            latitude: latitude,
            radius: 200
        }).then(function (response) {
            return response.data;
        }).catch(function (responseError) {
            return responseError.code;
        });
    }

    static getCityAirports(city) {
        this.refreshInstance1();
        return this.apiInstance1?.referenceData.locations.get({
            subType: 'AIRPORT',
            keyword: city,
            countryCode: 'IN'
        }).then(function (response) {
            return response.data;
        }).catch(function (responseError) {
            return responseError.code;
        });
    }

    static getPossibleRoutes(start, end) {
        // get city airports
        // if not, set direct_route = false, get nearest airports to source
        // get destination airports
        // if not, set direct_route = false, get nearest airports to destination
        // if direct_route == true, check if direct routes from source to destination exists
        // if not, set direct_route = false
        // if direct_route == false, create nested loops to check all routes from nearest starting airports to nearest ending airports
        // return the list
    }
}
