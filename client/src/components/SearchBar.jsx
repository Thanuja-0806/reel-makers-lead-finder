import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Loader2, Compass } from 'lucide-react';

const QUICK_CITIES = [
  'Mumbai', 'New York', 'London', 'Bangalore', 'Dubai', 'Los Angeles', 'Delhi', 'Toronto', 'Singapore', 'Sydney'
];

export default function SearchBar({ onSearch, isLoading, currentCity }) {
  const [cityInput, setCityInput] = useState(currentCity || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onSearch(cityInput.trim());
    }
  };

  const handleCityChip = (city) => {
    setCityInput(city);
    onSearch(city);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
        
        <div className="relative flex items-center glass-panel rounded-2xl p-2 shadow-2xl">
          <div className="pl-4 pr-2 text-indigo-400 flex items-center">
            <MapPin className="w-6 h-6 animate-bounce" />
          </div>

          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter City Name (e.g. Mumbai, New York, London, Bangalore...)"
            disabled={isLoading}
            className="w-full bg-transparent px-3 py-3 text-lg font-medium text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !cityInput.trim()}
            className="px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-purple flex items-center space-x-2 transition duration-200 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Find Reel Makers</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Select Chips */}
      <div className="mt-3 flex items-center flex-wrap gap-2 px-2">
        <span className="text-xs text-slate-400 font-medium flex items-center space-x-1 mr-1">
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>Quick City Ideas:</span>
        </span>
        {QUICK_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => handleCityChip(city)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-full text-xs font-medium transition duration-200 border ${
              cityInput.toLowerCase() === city.toLowerCase()
                ? 'bg-purple-600/30 text-purple-200 border-purple-500/50 shadow-glow-purple'
                : 'bg-slate-900/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:border-slate-500'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
