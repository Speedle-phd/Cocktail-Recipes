import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { authFetch } from "../axios/authFetch";
import CocktailTeaser from "../components/CocktailTeaser";
import useDebounce from "../customHooks/useDebounce";
import type { CocktailSummary } from "../types";

function isCocktailSummary(value: unknown): value is CocktailSummary {
  if (typeof value !== "object" || value === null) return false;
  return (
    "idDrink" in value && typeof value.idDrink === "string" &&
    "strDrink" in value && typeof value.strDrink === "string" &&
    "strDrinkThumb" in value && typeof value.strDrinkThumb === "string" &&
    (!("strAlcoholic" in value) || value.strAlcoholic === null || typeof value.strAlcoholic === "string") &&
    (!("strCategory" in value) || value.strCategory === null || typeof value.strCategory === "string")
  );
}

function readSearchResults(data: unknown): CocktailSummary[] {
  if (typeof data !== "object" || data === null || !("drinks" in data)) {
    throw new Error("Unexpected cocktail search response.");
  }
  const { drinks } = data;
  if (drinks === null || drinks === "no data found") return [];
  if (!Array.isArray(drinks) || !drinks.every(isCocktailSummary)) {
    throw new Error("Unexpected cocktail search results.");
  }
  return drinks;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alcoholType, setAlcoholType] = useState("Alcoholic");
  const [searchResults, setSearchResults] = useState<CocktailSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [requestNumber, setRequestNumber] = useState(0);
  const query = searchTerm.trim();
  const debouncedValue = useDebounce(query, 400);

  useEffect(() => {
    if (!query) {
      setSearchResults(null);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    setSearchResults(null);
    if (query !== debouncedValue) return;

    const controller = new AbortController();
    let active = true;
    const fetchResults = async () => {
      try {
        const encodedQuery = encodeURIComponent(debouncedValue);
        const { data } = await authFetch.get<unknown>(`/search.php?s=${encodedQuery}`, { signal: controller.signal });
        if (active) setSearchResults(readSearchResults(data));
      } catch (error) {
        if (!active) return;
        console.error("Cocktail search failed.", error);
        setError(true);
        setSearchResults([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchResults();
    return () => {
      active = false;
      controller.abort();
    };
  }, [query, debouncedValue, requestNumber]);

  const filteredCocktails = searchResults?.filter((cocktail) =>
    alcoholType === "all" || cocktail.strAlcoholic === alcoholType,
  ) ?? [];

  return (
    <section className="page shell">
      <div className="page-heading">
        <p className="eyebrow"><span className="eyebrow-dot" /> THE RECIPE COLLECTION</p>
        <h1>Find your <em>kind of drink.</em></h1>
        <p>Search by cocktail name to find your next favorite.</p>
      </div>
      <div className="search-panel">
        <div className="field search-field">
          <label htmlFor="name">COCKTAIL NAME</label>
          <div className="input-wrap"><FiSearch aria-hidden="true" /><input id="name" name="name" type="search" placeholder="Try a margarita..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></div>
        </div>
        <div className="field type-field">
          <label htmlFor="alcoholic">DRINK TYPE</label>
          <select id="alcoholic" name="alcoholic" value={alcoholType} onChange={(event) => setAlcoholType(event.target.value)}>
            <option value="all">All drinks</option>
            <option value="Alcoholic">Alcoholic</option>
            <option value="Non alcoholic">Non-alcoholic</option>
          </select>
        </div>
      </div>
      <p className="search-hint">Results update as you type.</p>
      <div className="results-heading"><h2>Explore the collection</h2><span>{searchResults !== null && !loading && !error ? `${filteredCocktails.length} RECIPES` : "PICK YOUR POUR"}</span></div>
      {loading ? (
        <div className="empty-state" role="status"><span className="loading-spinner" /> Finding your drinks...</div>
      ) : error ? (
        <div className="empty-state" role="alert">
          <p>Something went wrong. Please try your search again.</p>
          <button type="button" className="button button-outline" onClick={() => setRequestNumber((previous) => previous + 1)}>Try again</button>
        </div>
      ) : searchResults === null ? (
        <div className="empty-state"><span className="empty-symbol" aria-hidden="true">✳</span><h3>Your next favorite is waiting.</h3><p>Search for a cocktail to get started.</p></div>
      ) : filteredCocktails.length === 0 ? (
        <div className="empty-state"><span className="empty-symbol" aria-hidden="true">✳</span><h3>No matches this time.</h3><p>Try another name or drink type.</p></div>
      ) : (
        <div className="cocktail-grid">
          {[...filteredCocktails].sort((a, b) => a.strDrink.localeCompare(b.strDrink)).map((cocktail) => (
            <CocktailTeaser key={cocktail.idDrink} {...cocktail} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Search;
