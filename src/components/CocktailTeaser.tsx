import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { CocktailSummary } from "../types";

const CocktailTeaser = ({
  strCategory,
  strDrink,
  strDrinkThumb,
  idDrink,
  strAlcoholic,
}: CocktailSummary) => (
  <article className="cocktail-card">
    <Link className="cocktail-card-link" to={`/cocktail/${idDrink}`}>
      <div className="cocktail-card-image">
        <img src={strDrinkThumb} alt="" loading="lazy" />
        <span className="card-arrow" aria-hidden="true"><FiArrowUpRight /></span>
      </div>
      <div className="cocktail-card-info">
        <div>
          <p className="card-category">{strCategory || "Cocktail"}</p>
          <h3>{strDrink}</h3>
        </div>
        {strAlcoholic && <span className="card-tag">{strAlcoholic}</span>}
      </div>
    </Link>
  </article>
);

export default CocktailTeaser;
