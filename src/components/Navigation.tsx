import { Link, NavLink } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { FiArrowUpRight, FiHeart, FiMoon, FiSun } from "react-icons/fi";
import { useGlobalContext } from "../context/useContext";

type Theme = "light" | "dark";
const themeKey = "cocktail-theme";

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(themeKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch (error) {
    console.error("Could not read the theme preference.", error);
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const Navigation = () => {
  const { favorites } = useGlobalContext();
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem(themeKey, next);
    } catch (error) {
      console.error("Could not save the theme preference.", error);
    }
  };

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
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Dark mode" aria-pressed={theme === "dark"}>
            {theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <Link className="nav-cta" to="/search">Find your drink <FiArrowUpRight aria-hidden="true" /></Link>
        </nav>
      </header>
    </>
  );
};

export default Navigation;
