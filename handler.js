"use strict";
const axios = require("axios");
const csvtojsonV2 = require("csvtojson/v2");

const {
  LOCATION_CSV = "https://s3-us-west-2.amazonaws.com/valenceinterview/locations.csv",
  NUMBER_OF_DAYS = "5",
  WEATHER_API_KEY,
} = process.env;

/**
 * Main endpoint hook for the app that retrieve the
 * list of cities with the configured days forecast.
 */
module.exports.forecast = async (_event, _context, callback) => {
  if (!WEATHER_API_KEY) {
    callback(null, {
      statusCode: 500,
      body: "WEATHER_API_KEY needs to be configured on the .env file.",
    });
  }
  try {
    const cities = await retrieveCitiesFromCSV();
    const body = await Promise.all(weatherPromises(cities));
    callback(null, {
      statusCode: 200,
      body,
    });
  } catch (error) {
    callback(null, {
      statusCode: 500,
      body: error,
    });
  }
};

/**
 * Retrieves a list of cities from a CSV file.
 * @returns {array} - An array of cities name.
 */
async function retrieveCitiesFromCSV() {
  const response = await axios.get(LOCATION_CSV);
  const csv = await csvtojsonV2().fromString(response.data);
  return csv.map((location) => location.Location);
}

/**
 * Retrieves a list of weather forecast promises for a given set of cities.
 * @param {string[]} cities - An array of cities name.
 * @returns {array} - An array of Promises, each of which resolves to a weather forecast object for the corresponding city.
 */
function weatherPromises(cities) {
  return cities.map(
    (city) =>
      new Promise((resolve, reject) => {
        axios
          .get(
            encodeURI(
              `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=${NUMBER_OF_DAYS}&aqi=no&alerts=no`
            )
          )
          .then((result) =>
            resolve({
              [city]: result.data.forecast.forecastday.map(({ day, date }) => ({
                date,
                temp: day.avgtemp_c,
                // On code is "weather
                weather: day.condition.text,
                // On image is "description"
                // description: day.condition.text,
              })),
            })
          )
          .catch((err) => reject(err));
      })
  );
}
