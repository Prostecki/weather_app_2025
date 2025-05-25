import { useWeather } from "../../hooks/useWeather";
import { CurrentWeatherView } from "../CurrentWeather";
import SearchForm from "../SearchForm/SearchForm";

export default function CurrentWeather() {
  const { weatherData, error, loading, searchByCity } = useWeather();

  const handleSearch = (city) => {
    searchByCity(city);
  };

  return (
    <div className="weather-container">
      <SearchForm onSearch={handleSearch} />

      {loading && <div className="loading">Loading weather data...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && weatherData && (
        <CurrentWeatherView weatherData={weatherData} />
      )}
    </div>
  );
}
