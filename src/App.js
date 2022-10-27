import React from "react";
// import {FaTimes} from 'react-icons/fa'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GeneralStyling from './components/GeneralStyling'
import Home from './pages/Home'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import SingleCocktail from './pages/SingleCocktail'
import Errorpage from "./pages/Errorpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GeneralStyling />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />}/>
          <Route path="favorites" element={<Favorites />}/>
          <Route path="cocktail/:cocktailId" element={<SingleCocktail />}/>
          <Route path="*" element={<Errorpage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
