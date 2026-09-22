import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import SearchBar from "../components/searchBar/SearchBar";
import FilterSidebar from "../components/searchBar/FilterSidebar";
import ResultCard from "../components/searchBar/ResultCard";
import { buildSearchIndex } from "../data/searchIndex";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const allResults = useMemo(() => buildSearchIndex(), []);

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [appliedFilters, setAppliedFilters] = useState({
    location: "Any Location",
    maxPrice: Infinity,
  });
  const [locationDraft, setLocationDraft] = useState("Any Location");
  const [priceDraft, setPriceDraft] = useState(Infinity);

  const locations = useMemo(() => {
    const unique = new Set(allResults.map((r) => r.location).filter(Boolean));
    return Array.from(unique);
  }, [allResults]);

  const hasSearched = searchTerm.trim().length > 0;

  const filteredResults = useMemo(() => {
    if (!hasSearched) return [];

    let result = allResults;

    const query = searchTerm.toLowerCase();
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.location?.toLowerCase().includes(query) ||
        r.categoryLabel?.toLowerCase().includes(query),
    );

    if (activeCategory !== "All Categories") {
      result = result.filter((r) => r.category === activeCategory);
    }

    if (appliedFilters.location !== "Any Location") {
      result = result.filter((r) => r.location === appliedFilters.location);
    }

    result = result.filter((r) => r.price <= appliedFilters.maxPrice);

    return result;
  }, [allResults, searchTerm, hasSearched, activeCategory, appliedFilters]);

  const handleApply = () => {
    setAppliedFilters({ location: locationDraft, maxPrice: priceDraft });
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setActiveCategory("All Categories");
    setLocationDraft("Any Location");
    setPriceDraft(Infinity);
    setAppliedFilters({ location: "Any Location", maxPrice: Infinity });
  };

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-72 shrink-0">
            <FilterSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              locations={locations}
              locationDraft={locationDraft}
              setLocationDraft={setLocationDraft}
              priceDraft={priceDraft}
              setPriceDraft={setPriceDraft}
              onApply={handleApply}
              onClearAll={handleClearAll}
            />
          </div>

          <div className="flex-1">
            {hasSearched && (
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-bold text-xl text-[#172033]">
                  Search Results for "{searchTerm}"
                </h1>
                <span className="text-sm text-gray-400">
                  {filteredResults.length} Results Found
                </span>
              </div>
            )}

            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-xl border border-gray-200">
                <Search className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                  Start typing to search
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Search for events, hotels, tourist sites and more.
                </p>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <ResultCard
                    key={`${result.type}-${result.id}`}
                    result={result}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 font-medium">
                  No results found for "{searchTerm}"
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try a different search term or adjust your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
