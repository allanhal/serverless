# Weather Forecast Serverless App

## This app is responsible for downloading a csv file containing a list of cities, and then fetching the weather forecast for the next 5 days for each city.

## Features

- Downloads a csv file containing a list of cities
- Fetches the weather forecast for the next 5 days for each city in the csv
- Provides a JSON result for viewing the forecast information

## Before running...

> Create a `.env` file based on `.env.template` to add the configuration.

## Technical details

- The app uses [WeatherApi](https://weatherapi.com) to fetch the weather forecast data
- The app is built using:
  - [node](https://nodejs.org)
  - [serverless](https://github.com/serverless/serverless)
  - [axios](https://github.com/axios/axios)
  - [csvtojson](https://github.com/Keyang/node-csvtojson)
- Made to be deployed on AWS Lambda (leveraging serverless framework).

## Observation

- Since [MetaWeather](https://www.metaweather.com/api/) is returning 404, so I'm using OpenWeatherMap.
- I did an account on [WeatherApi](https://weatherapi.com) and used the api key.
- Also tried [OpenWeatherMap](https://openweathermap.org/) but the api key was not working (as per some thread it needs a 2 hour delay to activate).

## Example response for `forecast` endpoint:

```
{
    "statusCode": 200,
    "body": [
        {
            "San Diego": [
                {
                    "date": "2023-01-12",
                    "temp": 13.6,
                    "weather": "Partly cloudy"
                },
                {
                    "date": "2023-01-13",
                    "temp": 12.2,
                    "weather": "Cloudy"
                },
                ...
            ]
        },
        {
            "Omaha": [
                {
                    "date": "2023-01-13",
                    "temp": -3.1,
                    "weather": "Sunny"
                },
                {
                    "date": "2023-01-14",
                    "temp": 1.2,
                    "weather": "Overcast"
                },
                ...
            ]
        },
        ...
    ]
}
```
