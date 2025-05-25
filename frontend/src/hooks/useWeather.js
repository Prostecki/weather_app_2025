import { useState, useEffect, useCallback } from "react";
import { fetchWeatherByCoordinates, fetchWeatherByCity } from "../services/api";
import { getCurrentPosition } from "../services/geolocation";

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция поиска по городу доступна снаружи хука
  const searchByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(city);
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(`Failed to load weather data for ${city}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialWeatherData = async () => {
      try {
        // Пробуем получить погоду по координатам
        const position = await getCurrentPosition().catch(() => {
          console.log("Falling back to default city");
          return null;
        });

        if (position) {
          const { latitude, longitude } = position;
          console.log("User location:", latitude, longitude);
          const data = await fetchWeatherByCoordinates(latitude, longitude);
          setWeatherData(data);
        } else {
          // Если не удалось получить координаты, используем город по умолчанию
          const data = await fetchWeatherByCity("Stockholm");
          setWeatherData(data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialWeatherData();
  }, []);

  return { weatherData, error, loading, searchByCity };
};
