import { FiArrowRight, FiArrowUpRight, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import useFetch from "../customHooks/useFetch";

const Home = () => {
  const { cocktail: { drinks }, loading, error } = useFetch("/random.php");
  const drink = drinks?.[0];

  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> A LITTLE SOMETHING TO SIP ON</p>
          <h1>Good times<br />start with a <em>great drink.</em></h1>
          <p className="hero-description">
            A little inspiration for your next gathering, quiet evening, or just because.
            Find a new favorite, one sip at a time.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/search">Explore recipes <FiArrowRight aria-hidden="true" /></Link>
            <Link className="text-link" to="/favorites">Your favorites <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-note">
            <span className="note-star" aria-hidden="true">✳</span>
            <span>MADE FOR THE MOMENTS<br /><strong>worth celebrating.</strong></span>
          </div>
        </div>
        <div className="featured">
          <div className="featured-topline"><span>THE HOUSE PICK</span><span>01 / DISCOVER</span></div>
          {loading ? (
            <div className="featured-state" role="status"><span className="loading-spinner" /> Finding your next favorite...</div>
          ) : error ? (
            <div className="featured-state" role="alert">We couldn't load a drink. Please refresh the page.</div>
          ) : drink ? (
            <Link className="featured-link" to={`/cocktail/${drink.idDrink}`}>
              <div className="featured-image">
                <img src={drink.strDrinkThumb} alt="" />
                <span className="featured-badge">A LITTLE<br /><strong>INSPIRATION</strong><br />FOR YOU ✳</span>
              </div>
              <div className="featured-caption">
                <div><p>YOUR RANDOM PICK</p><h2>{drink.strDrink}</h2><span>{[drink.strCategory, drink.strAlcoholic].filter(Boolean).join(" · ")}</span></div>
                <span className="featured-arrow" aria-hidden="true"><FiArrowUpRight /></span>
              </div>
            </Link>
          ) : (
            <div className="featured-state">No drink found this time. Please refresh the page.</div>
          )}
        </div>
      </section>
      <section className="discovery-strip">
        <div className="shell discovery-inner">
          <span className="strip-icon" aria-hidden="true"><FiSearch /></span>
          <div><p className="eyebrow">SOMETHING IN MIND?</p><h2>There's a drink for that.</h2></div>
          <p>From the classics to something unexpected, your next go-to is waiting.</p>
          <Link className="button button-outline" to="/search">Find a recipe <FiArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
};

export default Home;
