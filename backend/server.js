import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/weather/current", (req, res) => {
  // Support both city name and coordinates
  const query = req.query.city || req.query.q || "Stockholm";
  const url = `${process.env.API_BASE_URL}/current.json?key=${process.env.WEATHER_API_KEY}&q=${query}`;

  fetchWeatherData(url)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      res.status(500).json({ error: "Failed to fetch current weather data" });
    });
});

app.get("/weather/forecast", (req, res) => {
  const query = req.query.city || req.query.q || "Stockholm";
  const days = req.query.days || 3;
  const url = `${process.env.API_BASE_URL}/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${query}&days=${days}`;

  fetchWeatherData(url)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("Error fetching forecast weather data:", error);
      res.status(500).json({ error: "Failed to fetch forecast weather data" });
    });
});

app.get("/api", (req, res) => {
  res.json({ message: "This is the API endpoint" });
});

async function fetchWeatherData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
