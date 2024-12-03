const str = require('./string.json');

module.exports = class TrainEndpoint {

    static getTrainsBetween(trainNum, startDate) {
        const request = require('request');
        return new Promise((resolve, reject) => {
            // FREE TRIAL
            const options = {
                method: 'GET',
                url: 'https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/status',
                qs: {
                    departure_date: startDate, // eg -> 20241225
                    isH5: 'true',
                    client: 'web',
                    train_number: trainNum  // eg -> 12051
                },
                headers: {
                    'x-rapidapi-key': 'c01798897bmshd112c88d70df705p153c21jsna34169dbe2a0',
                    'x-rapidapi-host': 'indian-railway-irctc.p.rapidapi.com',
                    'x-rapid-api': 'rapid-api-database'
                }
            };

            request(options, (error, response, body) => {
                if (error) {
                    reject(error); // Reject the promise if an error occurs
                } else {
                    resolve(JSON.parse(body)); // Resolve the promise with the parsed body
                }
            });
        });
    }

    static getTrainsBetween1(srcStCode, dstStCode) {
        const request = require('request');
        return new Promise((resolve, reject) => {
            // PAID API
            const options = {
                method: 'GET',
                url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
                qs: {
                    fromStationCode: 'BVI',
                    toStationCode: 'NDLS'
                },
                headers: {
                    'x-rapidapi-key': 'c01798897bmshd112c88d70df705p153c21jsna34169dbe2a0',
                    'x-rapidapi-host': 'irctc1.p.rapidapi.com'
                }
            };

            request(options, (error, response, body) => {
                if (error) {
                    reject(error); // Reject the promise if an error occurs
                } else {
                    resolve(JSON.parse(body)); // Resolve the promise with the parsed body
                }
            });
        });
    }

    // SLOW SERVER
    static getTrainsBetween2(srcStCode, dstStCode) {
        const fetch = require('node-fetch');
        const apiKey = str.apiKey;
        return new Promise((resolve, reject) => {
            const url = `https://indianrailapi.com/api/v2/TrainBetweenStation/apikey/${apiKey}/from/${srcStCode}/to/${dstStCode}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        reject(`Error ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }
}