import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const Errorpage = () => (
  <section className="shell page empty-state">
    <span className="empty-symbol" aria-hidden="true">✳</span>
    <h1>Looks like we're <em>off the menu.</em></h1>
    <p>Let's get you back to something good.</p>
    <Link className="button button-dark" to="/">Back to home <FiArrowRight aria-hidden="true" /></Link>
  </section>
);

export default Errorpage;
