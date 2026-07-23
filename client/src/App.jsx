import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AgentLoader from './components/AgentLoader';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import LeadCard from './components/LeadCard';
import LeadTable from './components/LeadTable';
import SettingsModal from './components/SettingsModal';
import QueryPreviewModal from './components/QueryPreviewModal';
import { Sparkles, Film, AlertCircle, Compass, Layers, ShieldCheck, FilmIcon, Search, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [logs, setLogs] = useState([]);
  const [queries, setQueries] = useState([]);
  const [leads, setLeads] = useState([]);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [hasInstagramOnly, setHasInstagramOnly] = useState(false);
  const [hasEmailOnly, setHasEmailOnly] = useState(false);
  const [hasPhoneOnly, setHasPhoneOnly] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState('All Specializations');
  const [sortBy, setSortBy] = useState('confidence');
  const [viewMode, setViewMode] = useState('cards');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQueriesOpen, setIsQueriesOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({ serpapi: '', googleApiKey: '' });

  const handleSearch = async (targetCity) => {
    const cleanCity = targetCity.trim();
    if (!cleanCity) return;

    setCity(cleanCity);
    setIsLoading(true);
    setIsComplete(false);
    setLogs([]);
    setLeads([]);

    const searchId = `search_${Date.now()}`;
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';

    // Establish SSE Stream Connection for Live Terminal Updates
    const eventSource = new EventSource(`${apiBaseUrl}/api/search/stream?searchId=${searchId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'STAGE_CHANGE') {
          setCurrentStage(data.stage);
        }
        if (data.type === 'QUERIES_GENERATED') {
          setQueries(data.queries);
        }

        setLogs(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          message: data.message,
          type: data.type
        }]);

        if (data.type === 'COMPLETE') {
          setIsComplete(true);
          setIsLoading(false);
          eventSource.close();
        }
        if (data.type === 'ERROR') {
          setIsLoading(false);
          eventSource.close();
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    // Execute Main API Search
    try {
      const response = await fetch(`${apiBaseUrl}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cleanCity, searchId, apiKeys })
      });

      const result = await response.json();
      if (result.success) {
        setLeads(result.leads || []);
        if (result.queriesExecuted) {
          setQueries(result.queries || []);
        }
      }
    } catch (err) {
      setLogs(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        message: `Network error: ${err.message}`,
        type: 'ERROR'
      }]);
    } finally {
      setIsLoading(false);
      setIsComplete(true);
      eventSource.close();
    }
  };

  // Filter & Sort Pipeline
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        // Name & Company Keyword Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = lead.fullName?.toLowerCase().includes(q);
          const compMatch = lead.companyName?.toLowerCase().includes(q);
          if (!nameMatch && !compMatch) return false;
        }

        // Toggles
        if (hasInstagramOnly && !lead.instagramUrl) return false;
        if (hasEmailOnly && !lead.email) return false;
        if (hasPhoneOnly && !lead.phone) return false;

        // Specialization
        if (selectedSpec !== 'All Specializations') {
          if (!lead.specialization?.toLowerCase().includes(selectedSpec.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'confidence') {
          const rank = { High: 3, Medium: 2, Low: 1 };
          return (rank[b.confidenceScore] || 0) - (rank[a.confidenceScore] || 0);
        }
        if (sortBy === 'alphabetical') {
          return (a.fullName || '').localeCompare(b.fullName || '');
        }
        if (sortBy === 'company') {
          return (a.companyName || '').localeCompare(b.companyName || '');
        }
        return 0;
      });
  }, [leads, searchQuery, hasInstagramOnly, hasEmailOnly, hasPhoneOnly, selectedSpec, sortBy]);

  return (
    <div className="min-h-screen pb-16">
      
      {/* Navigation Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenQueries={() => setIsQueriesOpen(true)}
        currentCity={city}
        leadsCount={leads.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Hero Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>AI Reel Makers & Videographers Discovery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Find Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">Reel Makers & Video Agencies</span> in Any City
          </h2>
          <p className="text-sm text-slate-400">
            Automated multi-query web search, company crawling, contact extraction, deduplication, and Excel download.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          currentCity={city}
        />

        {/* Agent Loading Indicator (No verbose console log in UI) */}
        {isLoading && (
          <AgentLoader
            currentStage={currentStage}
            city={city}
          />
        )}

        {/* Initial Empty / Welcome Landing State */}
        {!leads.length && !isLoading && (
          <div className="w-full max-w-2xl mx-auto mt-12 glass-panel rounded-3xl p-10 text-center border border-white/10 relative overflow-hidden">
            <div className="absolute -inset-10 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-glow-purple">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to Discover Creators?</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Enter any city name above to deploy the AI discovery agents. They will instantly identify local agencies, short video producers, and videographers.
            </p>
            <div className="flex justify-center space-x-6 text-xs text-slate-500 font-semibold border-t border-white/5 pt-6">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-Query Search</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Contact Extraction</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Excel Export</span>
              </span>
            </div>
          </div>
        )}

        {/* Stats Overview Dashboard */}
        {leads.length > 0 && (
          <StatsOverview leads={leads} city={city} />
        )}

        {/* Filters & Controls */}
        {leads.length > 0 && (
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hasInstagramOnly={hasInstagramOnly}
            setHasInstagramOnly={setHasInstagramOnly}
            hasEmailOnly={hasEmailOnly}
            setHasEmailOnly={setHasEmailOnly}
            hasPhoneOnly={hasPhoneOnly}
            setHasPhoneOnly={setHasPhoneOnly}
            selectedSpec={selectedSpec}
            setSelectedSpec={setSelectedSpec}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            leads={filteredLeads}
            city={city}
          />
        )}

        {/* Lead Results Grid / Table */}
        {leads.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Discovered Creators</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs font-mono">
                  {filteredLeads.length} of {leads.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any social or website link to view portfolio
              </p>
            </div>

            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLeads.map((lead, idx) => (
                  <LeadCard key={idx} lead={lead} />
                ))}
              </div>
            ) : (
              <LeadTable leads={filteredLeads} />
            )}

            {filteredLeads.length === 0 && (
              <div className="glass-panel rounded-2xl p-12 text-center border border-white/10">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Leads Match Your Filters</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try unchecking some filters or searching for another keyword.
                </p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
      />

      <QueryPreviewModal
        isOpen={isQueriesOpen}
        onClose={() => setIsQueriesOpen(false)}
        queries={queries}
        city={city}
      />

    </div>
  );
}
