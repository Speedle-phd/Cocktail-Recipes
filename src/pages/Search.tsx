import { useState, type FormEvent } from "react";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { authFetch } from "../axios/authFetch";
import CocktailTeaser from "../components/CocktailTeaser";
import type { Cocktail, CocktailResponse } from "../types";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alcoholType, setAlcoholType] = useState("Alcoholic");
  const [searchResults, setSearchResults] = useState<Cocktail[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const { data } = await authFetch.get<CocktailResponse>(
        `/search.php?s=${encodeURIComponent(searchTerm)}`,
      );
      setSearchResults(data.drinks ?? []);
    } catch {
      setError(true);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCocktails = searchResults?.filter(
    (cocktail) => cocktail.strAlcoholic === alcoholType,
  ) ?? [];

  return (
    <section className="page shell">
      <div className="page-heading">
        <p className="eyebrow"><span className="eyebrow-dot" /> THE RECIPE COLLECTION</p>
        <h1>Find your <em>kind of drink.</em></h1>
        <p>Old favorites, new discoveries, and everything in between.</p>
      </div>
      <form className="search-panel" onSubmit={handleSubmit}>
        <div className="field search-field">
          <label htmlFor="name">COCKTAIL NAME</label>
          <div className="input-wrap"><FiSearch aria-hidden="true" /><input id="name" name="name" type="search" placeholder="Try a margarita..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} required /></div>
        </div>
        <div className="field type-field">
          <label htmlFor="alcoholic">DRINK TYPE</label>
          <select id="alcoholic" name="alcoholic" value={alcoholType} onChange={(event) => setAlcoholType(event.target.value)}>
            <option value="Alcoholic">Alcoholic</option>
            <option value="Non alcoholic">Non-alcoholic</option>
          </select>
        </div>
        <button type="submit" className="button button-dark" disabled={loading}>Search <FiArrowRight aria-hidden="true" /></button>
      </form>
      <div className="results-heading"><h2>Explore the collection</h2><span>{searchResults !== null && !loading && !error ? `${filteredCocktails.length} RECIPES` : "PICK YOUR POUR"}</span></div>
      {loading ? (
        <div className="empty-state" role="status"><span className="loading-spinner" /> Finding your drinks...</div>
      ) : error ? (
        <div className="empty-state" role="alert">Something went wrong. Please try your search again.</div>
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
