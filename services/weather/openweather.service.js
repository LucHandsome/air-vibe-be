const axios = require("axios");
const RedisHelper = require("../../helpers/redis.helper");
const AppError = require("../../helpers/appError.helper");

class OpenWeatherService {
  static async getCurrentWeather(lat, lon) {
    try {
      const cacheKey = `weather:current:${lat}:${lon}`;
      const cachedData = await RedisHelper.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await axios.get(
        `${process.env.OPENWEATHER_BASE_URL}/weather`,
        {
          params: {
            lat,
            lon,
            appid: process.env.OPENWEATHER_API_KEY,
            units: "metric",
            lang: "vi"
          },
          timeout: 10000
        }
      );

      const weatherData = {
        location: {
          lat: response.data.coord.lat,
          lon: response.data.coord.lon,
          name: response.data.name,
          country: response.data.sys.country
        },
        current: {
          temperature: response.data.main.temp,
          feelsLike: response.data.main.feels_like,
          humidity: response.data.main.humidity,
          pressure: response.data.main.pressure,
          visibility: response.data.visibility,
          uvIndex: response.data.uvi || 0,
          weather: {
            main: response.data.weather[0].main,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon
          },
          wind: {
            speed: response.data.wind.speed,
            direction: response.data.wind.deg
          }
        },
        timestamp: new Date().toISOString()
      };

      await RedisHelper.set(
        cacheKey,
        JSON.stringify(weatherData),
        parseInt(process.env.WEATHER_CACHE_TTL) || 600
      );

      return weatherData;
    } catch (error) {
      if (error.response) {
        throw new AppError(
          `Weather API error: ${error.response.data.message}`,
          error.response.status
        );
      }
      throw new AppError("Failed to fetch weather data", 500);
    }
  }

  static async getWeatherForecast(lat, lon, days = 5) {
    try {
      const cacheKey = `weather:forecast:${lat}:${lon}:${days}`;
      const cachedData = await RedisHelper.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await axios.get(
        `${process.env.OPENWEATHER_BASE_URL}/forecast`,
        {
          params: {
            lat,
            lon,
            appid: process.env.OPENWEATHER_API_KEY,
            units: "metric",
            lang: "vi",
            cnt: days * 8
          },
          timeout: 10000
        }
      );

      const forecastData = {
        location: {
          lat: response.data.city.coord.lat,
          lon: response.data.city.coord.lon,
          name: response.data.city.name,
          country: response.data.city.country
        },
        forecast: response.data.list.map(item => ({
          datetime: item.dt_txt,
          timestamp: item.dt,
          temperature: {
            temp: item.main.temp,
            tempMin: item.main.temp_min,
            tempMax: item.main.temp_max,
            feelsLike: item.main.feels_like
          },
          humidity: item.main.humidity,
          pressure: item.main.pressure,
          weather: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          },
          wind: {
            speed: item.wind.speed,
            direction: item.wind.deg
          },
          clouds: item.clouds.all,
          precipitation: item.rain ? item.rain["3h"] || 0 : 0
        })),
        timestamp: new Date().toISOString()
      };

      await RedisHelper.set(
        cacheKey,
        JSON.stringify(forecastData),
        parseInt(process.env.FORECAST_CACHE_TTL) || 7200
      );

      return forecastData;
    } catch (error) {
      if (error.response) {
        throw new AppError(
          `Weather API error: ${error.response.data.message}`,
          error.response.status
        );
      }
      throw new AppError("Failed to fetch weather forecast", 500);
    }
  }

  static async getHourlyForecast(lat, lon) {
    try {
      const cacheKey = `weather:hourly:${lat}:${lon}`;
      const cachedData = await RedisHelper.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await axios.get(
        `${process.env.OPENWEATHER_BASE_URL}/forecast`,
        {
          params: {
            lat,
            lon,
            appid: process.env.OPENWEATHER_API_KEY,
            units: "metric",
            lang: "vi",
            cnt: 8
          },
          timeout: 10000
        }
      );

      const hourlyData = {
        location: {
          lat: response.data.city.coord.lat,
          lon: response.data.city.coord.lon,
          name: response.data.city.name,
          country: response.data.city.country
        },
        hourly: response.data.list.map(item => ({
          datetime: item.dt_txt,
          timestamp: item.dt,
          temperature: item.main.temp,
          feelsLike: item.main.feels_like,
          humidity: item.main.humidity,
          weather: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          },
          wind: {
            speed: item.wind.speed,
            direction: item.wind.deg
          },
          precipitation: item.rain ? item.rain["3h"] || 0 : 0
        })),
        timestamp: new Date().toISOString()
      };

      await RedisHelper.set(
        cacheKey,
        JSON.stringify(hourlyData),
        parseInt(process.env.WEATHER_CACHE_TTL) || 600
      );

      return hourlyData;
    } catch (error) {
      if (error.response) {
        throw new AppError(
          `Weather API error: ${error.response.data.message}`,
          error.response.status
        );
      }
      throw new AppError("Failed to fetch hourly forecast", 500);
    }
  }

  static async getWeatherByCity(cityName) {
    try {
      const cacheKey = `weather:city:${cityName.toLowerCase()}`;
      const cachedData = await RedisHelper.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await axios.get(
        `${process.env.OPENWEATHER_BASE_URL}/weather`,
        {
          params: {
            q: cityName,
            appid: process.env.OPENWEATHER_API_KEY,
            units: "metric",
            lang: "vi"
          },
          timeout: 10000
        }
      );

      const weatherData = {
        location: {
          lat: response.data.coord.lat,
          lon: response.data.coord.lon,
          name: response.data.name,
          country: response.data.sys.country
        },
        current: {
          temperature: response.data.main.temp,
          feelsLike: response.data.main.feels_like,
          humidity: response.data.main.humidity,
          pressure: response.data.main.pressure,
          visibility: response.data.visibility,
          weather: {
            main: response.data.weather[0].main,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon
          },
          wind: {
            speed: response.data.wind.speed,
            direction: response.data.wind.deg
          }
        },
        timestamp: new Date().toISOString()
      };

      await RedisHelper.set(
        cacheKey,
        JSON.stringify(weatherData),
        parseInt(process.env.WEATHER_CACHE_TTL) || 600
      );

      return weatherData;
    } catch (error) {
      if (error.response) {
        throw new AppError(
          `Weather API error: ${error.response.data.message}`,
          error.response.status
        );
      }
      throw new AppError("Failed to fetch weather data by city", 500);
    }
  }

  static validateCoordinates(lat, lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new AppError("Invalid coordinates format", 400);
    }

    if (latitude < -90 || latitude > 90) {
      throw new AppError("Latitude must be between -90 and 90", 400);
    }

    if (longitude < -180 || longitude > 180) {
      throw new AppError("Longitude must be between -180 and 180", 400);
    }

    return { lat: latitude, lon: longitude };
  }
}

module.exports = OpenWeatherService;