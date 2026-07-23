import React from 'react';
import { Search, Filter, ArrowUpDown, LayoutGrid, Table, CheckSquare, Square, RefreshCw } from 'lucide-react';
import ExportButton from './ExportButton';

const SPECIALIZATIONS = [
  'All Specializations',
  'Food',
  'Fashion',
  'Wedding',
  'Real Estate',
  'Corporate',
  'Travel',
  'Fitness'
];

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  hasInstagramOnly,
  setHasInstagramOnly,
  hasEmailOnly,
  setHasEmailOnly,
  hasPhoneOnly,
  setHasPhoneOnly,
  selectedSpec,
  setSelectedSpec,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  leads,
  city
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 mb-6 border border-white/10 space-y-4">
      {/* Top Row: Search & Action Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by Name, Company..."
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Filters & Controls */}
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto justify-end">
          
          {/* Specialization Dropdown */}
          <div className="relative">
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {SPECIALIZATIONS.map(spec => (
                <option key={spec} value={spec} className="bg-slate-900 text-slate-200">
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="confidence" className="bg-slate-900 text-slate-200">Sort by: Confidence</option>
              <option value="alphabetical" className="bg-slate-900 text-slate-200">Sort by: Name (A-Z)</option>
              <option value="company" className="bg-slate-900 text-slate-200">Sort by: Company</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/80 border border-slate-700/80 rounded-xl p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'cards' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'table' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          {/* Export to Excel */}
          <ExportButton leads={leads} city={city} />
        </div>
      </div>

      {/* Bottom Row: Checkbox Toggles */}
      <div className="flex items-center flex-wrap gap-4 pt-2 border-t border-white/5 text-xs font-medium text-slate-300">
        <span className="text-slate-400 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span>Filters:</span>
        </span>

        <button
          type="button"
          onClick={() => setHasInstagramOnly(!hasInstagramOnly)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition ${
            hasInstagramOnly
              ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
              : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          {hasInstagramOnly ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          <span>Has Instagram</span>
        </button>

        <button
          type="button"
          onClick={() => setHasEmailOnly(!hasEmailOnly)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition ${
            hasEmailOnly
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          {hasEmailOnly ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          <span>Has Email</span>
        </button>

        <button
          type="button"
          onClick={() => setHasPhoneOnly(!hasPhoneOnly)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition ${
            hasPhoneOnly
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          {hasPhoneOnly ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          <span>Has Phone</span>
        </button>
      </div>
    </div>
  );
}
