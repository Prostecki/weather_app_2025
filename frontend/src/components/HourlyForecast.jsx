const HourlyForecast = ({ forecastData }) => {
  if (!forecastData?.forecast?.forecastday) return null;

  const currentHour = new Date().getHours();
  const today = forecastData.forecast.forecastday[0];
  const tomorrow = forecastData.forecast.forecastday[1];

  // Combine hours for 24 hour forecast
  const hourlyData = [
    ...today.hour.slice(currentHour),
    ...tomorrow.hour.slice(0, currentHour + 1),
  ].slice(0, 24); // Limit to 24 hours

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if time is current hour
  const isCurrentHour = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    return (
      date.getHours() === now.getHours() &&
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth()
    );
  };

  return (
    <div className="p-6 pt-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-white">Hourly Forecast</h3>
        <span className="text-xs text-blue-300">← Scroll →</span>
      </div>

      {/* Custom scrollbar with Tailwind */}
      <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-2xl p-4 shadow-inner">
        <div
          className="flex gap-3 pb-2 overflow-x-auto scrollbar-thin scrollbar-track-blue-900/20 scrollbar-thumb-blue-300/30 snap-x"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(147, 197, 253, 0.3) rgba(30, 58, 138, 0.2)",
          }}
        >
          {hourlyData.map((hour, index) => (
            <div
              key={index}
              className={`
                flex flex-col items-center p-3 min-w-[85px] rounded-xl transition-all
                snap-start backdrop-blur-sm
                ${
                  isCurrentHour(hour.time)
                    ? "bg-blue-500/30 ring-2 ring-blue-300/40"
                    : "bg-white/5 hover:bg-white/10"
                }
              `}
            >
              <p
                className={`text-sm font-medium mb-1 ${
                  isCurrentHour(hour.time) ? "text-white" : "text-blue-200"
                }`}
              >
                {formatTime(hour.time)}
              </p>

              <div className="relative my-1">
                <img
                  src={hour.condition.icon}
                  alt={hour.condition.text}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <p className="text-xl font-medium text-white">
                {Math.round(hour.temp_c)}°
              </p>

              <p
                className="text-xs text-blue-200 mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                title={hour.condition.text}
              >
                {hour.condition.text.length > 12
                  ? hour.condition.text.slice(0, 10) + "..."
                  : hour.condition.text}
              </p>

              <p className="text-xs text-blue-300/80 mt-2">
                {hour.chance_of_rain > 0 && `${hour.chance_of_rain}% 💧`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
