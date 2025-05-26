const TenDayForecast = ({ forecastData }) => {
  if (!forecastData?.forecast?.forecastday) return null;

  // Get all forecast days
  const forecastDays = forecastData.forecast.forecastday;

  // Format date to day name (e.g., "Monday")
  const formatDay = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if date is today or tomorrow
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    // Otherwise return day name
    return date.toLocaleDateString(undefined, { weekday: "long" });
  };

  return (
    <div className="p-6 pt-2">
      <h3 className="text-xl font-medium text-white mb-4">3-Day Forecast</h3>

      <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-2xl shadow-inner">
        {forecastDays.map((day, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 ${
              index !== forecastDays.length - 1
                ? "border-b border-blue-700/30"
                : ""
            }`}
          >
            <div className="flex items-center">
              <div className="w-24">
                <p className="text-white font-medium">{formatDay(day.date)}</p>
                <p className="text-xs text-blue-300">{day.date}</p>
              </div>

              <div className="flex items-center ml-2">
                <img
                  src={day.day.condition.icon}
                  alt={day.day.condition.text}
                  className="w-10 h-10"
                />
                <span className="ml-2 text-sm text-blue-200">
                  {day.day.condition.text}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex flex-col items-end mr-4">
                <div className="flex items-center">
                  <span className="text-xs text-blue-300 mr-1">💧</span>
                  <span className="text-sm text-blue-200">
                    {day.day.daily_chance_of_rain}%
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-blue-300 mr-1">💨</span>
                  <span className="text-sm text-blue-200">
                    {day.day.maxwind_kph} km/h
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-blue-300 text-sm mr-2">
                  {Math.round(day.day.mintemp_c)}°
                </span>
                <div className="w-16 h-2 rounded-full bg-blue-900/50 relative">
                  <div
                    className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                    style={{
                      width: "100%",
                      transform: `scaleX(${
                        (day.day.maxtemp_c - day.day.mintemp_c) / 30
                      })`,
                    }}
                  ></div>
                </div>
                <span className="text-white text-sm ml-2">
                  {Math.round(day.day.maxtemp_c)}°
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TenDayForecast;
