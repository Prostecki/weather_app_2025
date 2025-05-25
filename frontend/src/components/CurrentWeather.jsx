import { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm/SearchForm";

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

  // Icons as constants for better readability
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
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );

  const feelsLikeIcon = (
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const { location, current } = weatherData;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{location.name}</h2>
          <p className="text-blue-200">{location.country}</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold text-white">{current.temp_c}°C</p>
          <p className="text-blue-200">{current.condition.text}</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <WeatherDetailItem
          icon={feelsLikeIcon}
          label="Feels Like"
          value={`${current.feelslike_c}°C`}
        />
        <WeatherDetailItem
          icon={humidityIcon}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <WeatherDetailItem
          icon={windIcon}
          label="Wind"
          value={`${current.wind_kph} km/h ${current.wind_dir}`}
        />
        <WeatherDetailItem
          icon={pressureIcon}
          label="Pressure"
          value={`${current.pressure_mb} mb`}
        />
      </div>
    </div>
  );
};

// Loading and error components extracted for better readability
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-6 text-center">
    <div className="bg-red-500/20 text-white p-4 rounded-xl">{message}</div>
  </div>
);

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherByCity = async (city) => {
    if (!city) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/weather/current?city=${city}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
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
    </div>
  );
}
