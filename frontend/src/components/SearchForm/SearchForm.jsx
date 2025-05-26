import { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto my-6">
      <div className="relative flex items-center overflow-hidden rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="flex-grow px-5 py-3 bg-transparent text-white placeholder-blue-200 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
