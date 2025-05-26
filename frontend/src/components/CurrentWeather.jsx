import { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm/SearchForm";
import HourlyForecast from "./HourlyForecast";
import TenDayForecast from "./TenDayForecast";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
  </div>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="p-6 text-center">
    <div className="bg-red-500/20 text-white p-4 rounded-xl">{message}</div>
  </div>
);

// Extracted weather detail item component for better reuse
const WeatherDetailItem = ({ icon, label, value }) => (
  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl">
    {icon}
    <p className="text-sm text-blue-200">{label}</p>
    <p className="text-xl font-medium text-white">{value}</p>
  </div>
);

// Separated presentation component
const CurrentWeatherView = ({ weatherData }) => {
  if (!weatherData?.current) return null;

  // Add icons definitions here
  const humidityIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-blue-300 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
      />
    </svg>
  );

  const windIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-blue-300 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
      />
    </svg>
  );

  const pressureIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-blue-300 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );

  return (
    <div className="p-6 bg-blue-900/50 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center">
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
              className="w-12 h-12 mr-2"
            />
            <div>
              <h2 className="text-3xl font-bold text-white">
                {weatherData.location.name}
              </h2>
              <p className="text-lg text-blue-200">
                {weatherData.current.condition.text}
              </p>
            </div>
          </div>
          <p className="mt-2 text-5xl font-bold text-white">
            {Math.round(weatherData.current.temp_c)}°C
          </p>
          <p className="text-blue-300">
            Feels like {Math.round(weatherData.current.feelslike_c)}°C
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <WeatherDetailItem
            icon={humidityIcon}
            label="Humidity"
            value={`${weatherData.current.humidity}%`}
          />
          <WeatherDetailItem
            icon={windIcon}
            label="Wind"
            value={`${weatherData.current.wind_kph} km/h`}
          />
          <WeatherDetailItem
            icon={pressureIcon}
            label="Pressure"
            value={`${weatherData.current.pressure_mb} hPa`}
          />
        </div>
      </div>
    </div>
  );
};

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState(null); // No default city

  // Get user location and fetch weather on component mount
  useEffect(() => {
    const getUserLocationAndFetchWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          // Success callback
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              console.log("User position:", latitude, longitude);

              // Fetch weather by coordinates
              const locationResponse = await fetch(
                `http://localhost:3000/weather/current?q=${latitude},${longitude}`
              );

              if (!locationResponse.ok) {
                throw new Error(`HTTP error! status: ${locationResponse.status}`);
              }

              const locationData = await locationResponse.json();
              const detectedCity = locationData.location.name;
              console.log("Detected city:", detectedCity);

              // Set the detected city and fetch weather
              setCurrentCity(detectedCity);
              fetchWeatherByCity(detectedCity);
            } catch (error) {
              console.error("Error getting location data:", error);
              // Fallback to default city
              setCurrentCity("London");
              fetchWeatherByCity("London");
            }
          },
          // Error callback
          (error) => {
            console.error("Geolocation error:", error);
            // Fallback to default city
            setCurrentCity("London");
            fetchWeatherByCity("London");
          },
          // Options
          { timeout: 10000 } // 10 second timeout
        );
      } else {
        console.log("Geolocation not supported");
        // Fallback to default city
        setCurrentCity("London");
        fetchWeatherByCity("London");
      }
    };

    getUserLocationAndFetchWeather();
  }, []); // Empty dependency array - only run on mount

  // Updated useEffect to handle changes to currentCity
  useEffect(() => {
    // Only fetch if we have a city and it's not the initial fetch
    if (currentCity && !loading) {
      fetchWeatherByCity(currentCity);
    }
  }, [currentCity]); // This will now only run when currentCity changes after initial load

  // Fetch weather data function remains the same
  const fetchWeatherByCity = async (city) => {
    if (!city) return;

    setLoading(true);
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `http://localhost:3000/weather/current?city=${city}`
      );
      if (!currentResponse.ok) {
        throw new Error(`HTTP error! status: ${currentResponse.status}`);
      }
      const currentData = await currentResponse.json();
      setWeatherData(currentData);

      // Fetch forecast data
      const forecastResponse = await fetch(
        `http://localhost:3000/weather/forecast?city=${city}&days=10`
      );
      if (!forecastResponse.ok) {
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);
      setError(null);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="px-6 flex justify-center">
        <SearchForm onSearch={fetchWeatherByCity} />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && weatherData && (
        <CurrentWeatherView weatherData={weatherData} />
      )}
      {forecastData && <HourlyForecast forecastData={forecastData} />}
      {forecastData && <TenDayForecast forecastData={forecastData} />}
    </div>
  );
}
