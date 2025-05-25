import "./App.css";
import CurrentWeather from "./components/CurrentWeather.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 mt-4">
          Weather <span className="text-blue-300">Forecast</span>
        </h1>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          <CurrentWeather />
        </div>
      </div>
    </div>
  );
}

export default App;
