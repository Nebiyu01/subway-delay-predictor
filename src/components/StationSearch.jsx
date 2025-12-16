"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, X } from "lucide-react";

export default function StationSearch({ onStationSelect, selectedStation }) {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const searchRef = useRef(null);

  // Fetch stations based on search
  const { data: stationsData, isLoading } = useQuery({
    queryKey: ["stations", searchText],
    queryFn: async () => {
      const response = await fetch(
        `/api/mta/stations${searchText ? `?search=${encodeURIComponent(searchText)}` : ""}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stations");
      }

      return response.json();
    },
    enabled: searchText.length >= 2 || searchText.length === 0,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStationSelect = (station) => {
    onStationSelect(station);
    setSearchText(station.stop_name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchText("");
    onStationSelect(null);
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setIsOpen(true);
  };

  const stations = stationsData?.stations || [];
  const filteredStations = stations;

  return (
    <div
      ref={searchRef}
      className="relative rounded-[36px] border border-[#22232A] bg-[#111217] shadow-[0_30px_90px_rgba(0,0,0,0.55)] transition-all duration-200 focus-within:border-[#4C75FF] focus-within:shadow-[0_0_0_1px_rgba(76,117,255,0.85),0_25px_70px_rgba(0,0,0,0.55)]"
    >
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search size={20} className="text-[#7A8096]" />
      </div>

      <input
        type="text"
        placeholder="Search for a station (e.g., Times Square, Union Sq)"
        value={searchText}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="w-full bg-transparent border-0 rounded-[36px] pl-14 pr-14 py-5 text-lg text-white placeholder-[#7A8096]"
      />

      {searchText && (
        <button
          onClick={handleClear}
          className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-[#1D1F28] rounded-full transition-colors"
        >
          <X size={18} className="text-[#9CA3AF]" />
        </button>
      )}

      {/* Dropdown Results */}
      {isOpen && (searchText.length >= 2 || searchText.length === 0) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#1A1B21] border border-[#24252F] rounded-[28px] shadow-[0_40px_80px_rgba(0,0,0,0.65)] max-h-[420px] overflow-y-auto z-50">
          {isLoading && (
            <div className="p-4 text-center text-sm text-[#7B8299]">
              Loading stations...
            </div>
          )}

          {!isLoading && filteredStations.length === 0 && (
            <div className="p-4 text-center text-sm text-[#7B8299]">
              No stations found
            </div>
          )}

          {!isLoading && filteredStations.length > 0 && (
            <ul>
              {filteredStations.map((station) => (
                <li key={station.stop_id}>
                  <button
                    onClick={() => handleStationSelect(station)}
                    className={`w-full flex items-center gap-3 px-5 py-4 transition-colors text-left ${
                      selectedStation?.stop_id === station.stop_id
                        ? "bg-[#20222E]"
                        : "hover:bg-[#1F1F27]"
                    }`}
                  >
                    <MapPin
                      size={16}
                      className={`flex-shrink-0 ${
                        selectedStation?.stop_id === station.stop_id
                          ? "text-[#4C75FF]"
                          : "text-[#777E95]"
                      }`}
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium text-sm ${
                          selectedStation?.stop_id === station.stop_id
                            ? "text-white"
                            : "text-[#E3E7F2]"
                        }`}
                      >
                        {station.stop_name}
                      </div>
                      <div className="text-xs text-[#7B8299]">
                        Stop ID: {station.stop_id}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && searchText.length < 2 && (
            <div className="p-3 text-xs text-[#4E5568] border-t border-[#1A2233]">
              Showing top stations. Type to search for more.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
