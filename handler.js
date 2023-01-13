"use strict";
const axios = require("axios");
const csvtojsonV2 = require("csvtojson/v2");

const LOCATION_CSV =
  "https://s3-us-west-2.amazonaws.com/valenceinterview/locations.csv";
const NUMBER_OF_DAYS = 5;
const WEATHER_API_KEY = "72d664a7d46d427c86c53707231301";

module.exports.endpoint = async (_event, _context, callback) => {
  const response = await axios.get(LOCATION_CSV);

  // MetaWeather (https://www.metaweather.com/api/)
  // MetaWeather is returning 404, so I'm using OpenWeatherMap.

  // OpenWeatherMap
  // OpenWeatherMap ApiKey 01eb7934f459cf4457b03b562f0b06fd
  // api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&appid=01eb7934f459cf4457b03b562f0b06fd

  const csv = await csvtojsonV2().fromString(response.data);
  const cities = csv.map((location) => location.Location);
  try {
    const cityPromises = cities.map(
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
                [city]: result.data.forecast.forecastday.map(
                  ({ day, date }) => ({
                    date,
                    temp: day.avgtemp_c,
                    // On code is "weather
                    weather: day.condition.text,
                    // On image is "description"
                    // description: day.condition.text,
                  })
                ),
              })
            )
            .catch((err) => reject(err));
        })
    );
    const body = await Promise.all(cityPromises);
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
