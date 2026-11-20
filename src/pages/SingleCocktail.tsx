import { FiArrowLeft, FiHeart } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useGlobalContext } from "../context/useContext";
import useFetch from "../customHooks/useFetch";

const SingleCocktail = () => {
  const { favorites, addToFavorites, removeFromFavorites } = useGlobalContext();
  const { cocktailId } = useParams();
  const { cocktail: { drinks }, loading, error } = useFetch(`/lookup.php?i=${cocktailId ?? ""}`);

  if (loading) {
    return <div className="shell empty-state page" role="status"><span className="loading-spinner" /> Getting your recipe...</div>;
  }
  if (error) {
    return <div className="shell empty-state page" role="alert"><h1>Something went wrong.</h1><p>Please refresh the page to try again.</p></div>;
  }

  const drink = drinks?.[0];
  if (!drink) {
    return <div className="shell empty-state page"><h1>Cocktail not found.</h1><Link className="button button-dark" to="/search">Explore recipes</Link></div>;
  }

  const ingredients = Array.from({ length: 15 }, (_, index) => ({
    name: drink[`strIngredient${index + 1}`],
    measure: drink[`strMeasure${index + 1}`],
    index,
  })).filter((ingredient) => Boolean(ingredient.name));
  const isFavorite = favorites.some((favorite) => favorite.idDrink === drink.idDrink);

  return (
    <section className="page shell recipe-page">
      <Link className="back-link" to="/search"><FiArrowLeft aria-hidden="true" /> Back to recipes</Link>
      <div className="recipe-layout">
        <div className="recipe-image"><img src={drink.strDrinkThumb} alt={drink.strDrink} /><span className="recipe-image-note">GOOD DRINKS<br />GOOD MOMENTS <span aria-hidden="true">✳</span></span></div>
        <div className="recipe-content">
          <p className="eyebrow"><span className="eyebrow-dot" /> THE RECIPE</p>
          <h1>{drink.strDrink}</h1>
          <div className="recipe-tags">{drink.strCategory && <span>{drink.strCategory}</span>}{drink.strAlcoholic && <span>{drink.strAlcoholic}</span>}</div>
          <button className={`button ${isFavorite ? "button-outline" : "button-dark"}`} onClick={() => isFavorite ? removeFromFavorites(drink.idDrink) : addToFavorites(drink)} aria-pressed={isFavorite}>
            <FiHeart aria-hidden="true" /> {isFavorite ? "Saved to favorites" : "Save to favorites"}
          </button>
          <div className="recipe-divider" />
          <div className="recipe-section"><div className="recipe-section-title"><span>01</span><h2>What you'll need</h2></div>
            <ul className="ingredients-list">{ingredients.map(({ name, measure, index }) => <li key={index}><span>{name}</span><span>{measure}</span></li>)}</ul>
          </div>
          <div className="recipe-section"><div className="recipe-section-title"><span>02</span><h2>Let's make it</h2></div><p>{drink.strInstructions}</p></div>
          {drink.strGlass && <div className="serve-note"><span>BEST ENJOYED IN</span><strong>{drink.strGlass}</strong><span aria-hidden="true">✳</span></div>}
        </div>
      </div>
    </section>
  );
};

export default SingleCocktail;
