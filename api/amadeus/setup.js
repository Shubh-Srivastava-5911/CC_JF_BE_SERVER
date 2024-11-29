const str = require('./string.json');

const Amadeus = require('amadeus');

module.exports = class FlightEndpoint {
    static apiInstance = null;

    /**
     * 
     */
    static refreshInstance() {
        this.apiInstance = new Amadeus({
            clientId: str.apiKey,
            clientSecret: str.apiSecret
        });
    }

    /**
     * 
     * @param {*} location 
     * @returns 
     */
    static getDirectRoutes(arptCode) {
        this.refreshInstance();
        return this.apiInstance?.airport.directDestinations.get({
            departureAirportCode: arptCode,
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error;
        });
    }

    /**
     * 
     * @param {*} latitude 
     * @param {*} longitude 
     * @returns 
     */
    static getNearestAirports(latitude, longitude) {
        this.refreshInstance();
        return this.apiInstance?.referenceData.locations.airports.get({
            longitude: longitude,
            latitude: latitude,
            radius: 200
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error;
        });
    }

    /**
     * 
     * @param {*} city 
     * @returns 
     */
    static getCityAirports(city) {
        this.refreshInstance();
        return this.apiInstance?.referenceData.locations.get({
            subType: 'AIRPORT',
            keyword: city,
            countryCode: 'IN'
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error;
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

    static getRoutesBetween(srcCityLatitude, srcCityLongitude, dstCityLatitude, dstCityLongitude) {
        let srcAirports, dstAirports;
        let finalRoutes = [];
        return this.getNearestAirports(srcCityLatitude, srcCityLongitude)
            .then((res) => {
                srcAirports = res;
                return this.getNearestAirports(dstCityLatitude, dstCityLongitude);
            })
            .then((res) => {
                dstAirports = res;
                let routePromises = [];
                for (let srcAirport of srcAirports) {
                    let tempRoutes;
                    let tempPromise = this.getDirectRoutes(srcAirport.iataCode)
                        .then((res) => {
                            tempRoutes = res;
                            for (let route of tempRoutes) {
                                for (let dstAirport of dstAirports) {
                                    if (dstAirport.iataCode == route.iataCode) {
                                        finalRoutes.push({ srcAirport, route, dstAirport });
                                    }
                                }
                            }
                        })
                        .catch((error) => {
                            throw error;
                        });
                    routePromises.push(tempPromise);
                }
                return Promise.all(routePromises).then(() => {
                    return finalRoutes;
                });
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
    }

    static getFlightsBetween(srcArptCode, dstArptCode, startDate) {
        this.refreshInstance();
        return this.apiInstance?.shopping.flightOffersSearch.get({
            originLocationCode: srcArptCode,
            destinationLocationCode: dstArptCode,
            departureDate: startDate,
            adults: 1
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            throw error; // Prints error description
        });
    }
}



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

