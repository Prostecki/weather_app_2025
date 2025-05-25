const API_URL = "http://localhost:3000";

export const fetchWeatherByCoordinates = async (lat, lon) => {
  const response = await fetch(`${API_URL}/weather/current?q=${lat},${lon}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchWeatherByCity = async (city) => {
  const response = await fetch(`${API_URL}/weather/current?city=${city}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
