import { Link, NavLink } from "react-router-dom";
import { FiArrowUpRight, FiHeart } from "react-icons/fi";
import { useGlobalContext } from "../context/useContext";

const Navigation = () => {
  const { favorites } = useGlobalContext();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <nav className="nav shell" aria-label="Main navigation">
          <Link className="brand" to="/" aria-label="Cocktail Recipes home">
            <span className="brand-mark" aria-hidden="true">✳</span>
            <span className="brand-text">the cocktail <em>club</em><small>RECIPES FOR GOOD TIMES</small></span>
          </Link>
          <div className="nav-links">
            <NavLink className={linkClass} to="/" end>Discover</NavLink>
            <NavLink className={linkClass} to="/search">Explore recipes</NavLink>
            <NavLink className={linkClass} to="/favorites">
              <FiHeart aria-hidden="true" /> Favorites
              {favorites.length > 0 && <span className="nav-count">{favorites.length}</span>}
            </NavLink>
          </div>
          <Link className="nav-cta" to="/search">Find your drink <FiArrowUpRight aria-hidden="true" /></Link>
        </nav>
      </header>
    </>
  );
};

export default Navigation;
