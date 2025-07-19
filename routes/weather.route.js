const express = require("express");
const router = express.Router();
const CurrentWeatherController = require("../controllers/weather/current.controller");
const ForecastController = require("../controllers/weather/forecast.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// ✅ ĐẶT ROUTE CỤ THỂ TRƯỚC (city)
router.get(
  "/current/city/:cityName",
  verifyToken,
  CurrentWeatherController.getCurrentWeatherByCity
);

// ✅ ĐẶT ROUTE CHUNG SAU (coordinates)
router.get(
  "/current/:lat/:lon",
  verifyToken,
  CurrentWeatherController.getCurrentWeatherByCoords
);

router.get(
  "/forecast/:lat/:lon",
  verifyToken,
  ForecastController.getWeatherForecast
);

router.get(
  "/hourly/:lat/:lon",
  verifyToken,
  ForecastController.getHourlyForecast
);

module.exports = router;