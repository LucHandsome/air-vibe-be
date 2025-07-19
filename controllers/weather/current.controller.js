const OpenWeatherService = require("../../services/weather/openweather.service");
const AppError = require("../../helpers/appError.helper");

class CurrentWeatherController {
  static async getCurrentWeatherByCoords(req, res, next) {
    try {
      const { lat, lon } = req.params;

      const coordinates = OpenWeatherService.validateCoordinates(lat, lon);
      const weatherData = await OpenWeatherService.getCurrentWeather(
        coordinates.lat,
        coordinates.lon
      );

      res.status(200).json({
        success: true,
        data: weatherData,
        message: "Current weather data retrieved successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentWeatherByCity(req, res, next) {
    try {
      const { cityName } = req.params;

      if (!cityName || cityName.trim().length === 0) {
        throw new AppError("City name is required", 400);
      }

      // ✅ ĐÚNG: Gọi trực tiếp getWeatherByCity với cityName
      const weatherData = await OpenWeatherService.getWeatherByCity(cityName);

      res.status(200).json({
        success: true,
        data: weatherData,
        message: "Current weather data retrieved successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CurrentWeatherController;