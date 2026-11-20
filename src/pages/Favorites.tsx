import { useState } from "react";
import { FiArrowRight, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import CocktailTeaser from "../components/CocktailTeaser";
import { useGlobalContext } from "../context/useContext";

const Favorites = () => {
  const { favorites, removeFromFavorites } = useGlobalContext();
  const [query, setQuery] = useState("");
  const filteredFavorites = favorites.filter((favorite) =>
    favorite.strDrink.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="page shell">
      <div className="page-heading">
        <p className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL COLLECTION</p>
        <h1>The drinks you <em>love.</em></h1>
        <p>Keep the good ones close. Your saved recipes live right here.</p>
      </div>
      <div className="favorite-search field">
        <label htmlFor="favorite-search">SEARCH YOUR FAVORITES</label>
        <div className="input-wrap"><FiSearch aria-hidden="true" /><input id="favorite-search" type="search" placeholder="Find a saved drink..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      </div>
      <div className="results-heading"><h2>Your collection</h2><span>{filteredFavorites.length} SAVED</span></div>
      {filteredFavorites.length === 0 ? (
        <div className="empty-state">
          <span className="empty-symbol" aria-hidden="true">♡</span>
          <h3>{favorites.length === 0 ? "A collection worth making." : "No favorites found."}</h3>
          <p>{favorites.length === 0 ? "Save a recipe and it'll be here whenever you need it." : "Try searching for something else."}</p>
          {favorites.length === 0 && <Link className="button button-dark" to="/search">Explore recipes <FiArrowRight aria-hidden="true" /></Link>}
        </div>
      ) : (
        <div className="cocktail-grid">
          {filteredFavorites.map((favorite) => (
            <div key={favorite.idDrink} className="favorite-card">
              <CocktailTeaser {...favorite} />
              <button className="remove-button" onClick={() => removeFromFavorites(favorite.idDrink)} aria-label={`Remove ${favorite.strDrink} from favorites`}><FiTrash2 aria-hidden="true" /> Remove</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Favorites;
