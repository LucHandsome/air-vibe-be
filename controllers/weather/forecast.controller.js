const OpenWeatherService = require("../../services/weather/openweather.service");
const AppError = require("../../helpers/appError.helper");

class ForecastController {
  static async getWeatherForecast(req, res, next) {
    try {
      const { lat, lon } = req.params;
      const { days = 5 } = req.query;
      
      const coordinates = OpenWeatherService.validateCoordinates(lat, lon);
      
      const daysNumber = parseInt(days);
      if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 5) {
        throw new AppError("Days parameter must be between 1 and 5", 400);
      }

      const forecastData = await OpenWeatherService.getWeatherForecast(
        coordinates.lat,
        coordinates.lon,
        daysNumber
      );

      res.status(200).json({
        success: true,
        data: forecastData,
        message: "Weather forecast retrieved successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHourlyForecast(req, res, next) {
    try {
      const { lat, lon } = req.params;
      
      const coordinates = OpenWeatherService.validateCoordinates(lat, lon);
      const hourlyData = await OpenWeatherService.getHourlyForecast(
        coordinates.lat,
        coordinates.lon
      );

      res.status(200).json({
        success: true,
        data: hourlyData,
        message: "Hourly forecast retrieved successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ForecastController;