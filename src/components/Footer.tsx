import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="site-footer">
    <div className="shell footer-inner">
      <div>
        <span className="footer-mark" aria-hidden="true">✳</span>
        <span className="footer-brand">the cocktail <em>club</em></span>
      </div>
      <p>Good drinks. Better moments. Recipes from <a href="https://www.thecocktaildb.com/" target="_blank" rel="noreferrer">TheCocktailDB</a>.</p>
      <Link to="/search">Explore the recipes <span aria-hidden="true">↗</span></Link>
    </div>
  </footer>
);

export default Footer;
