import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";

const GeneralStyling = () => {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default GeneralStyling;
