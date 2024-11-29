const str = require('./string.json');
const { State, City } = require('country-state-city');

module.exports = class CitiesEndpoint {

    /**
     * 
     * @returns 
     */
    static getStatesOfIndia() {
        return new Promise((resolve, reject) => {
            try {
                const states = State.getStatesOfCountry('IN');
                const cities = City.getCitiesOfState('IN', 'UT');
                resolve( states );
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {*} stateCode 
     * @returns 
     */
    static getCitiesOfState(stateCode) {
        return new Promise((resolve, reject) => {
            try {
                const cities = City.getCitiesOfState('IN', stateCode);
                resolve( cities );
            } catch (error) {
                reject(error);
            }
        });
    }

    static getLatLonOfCity(cityName, stateCode) {
        let cities;
        return this.getCitiesOfState(stateCode)
            .then((res) => {
                cities = res;
                for(let city of cities) {
                    if(city.name.toLowerCase() == cityName.toLowerCase()) {
                        return {
                            lat : city.latitude,
                            lon : city.longitude
                        };
                    }
                }
                throw new Error("City not found");
            })
            .catch((error) => {
                return error.code;
            });
    }

}