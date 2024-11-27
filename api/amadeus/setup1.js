const axios = require('axios');

module.exports = class FlightEndpoint {
    static options = {
        method: '',
        url: '',
        params: {},
        headers: {
          'x-rapidapi-key': 'c01798897bmshd112c88d70df705p153c21jsna34169dbe2a0',
          'x-rapidapi-host': 'amadeus-api2.p.rapidapi.com'
        }
    };

    static async getDirectRoutes(location) {
        options.method = 'GET';
        options.url = 'https://amadeus-api2.p.rapidapi.com/airport-routes-direct-destination',
        options.params = { departureAirportCode: location };
    
        return axios.request(options)
        .then(response => response.data)
        .catch(error => error.response ? error.response.status : error.message);
    }
    
}