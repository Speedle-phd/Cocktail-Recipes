import React from 'react'
import navCocktailParty from '../assets/images/nav-cocktail-party.jpg'
import { NavLink } from 'react-router-dom'
import { AiFillHome, AiFillStar, AiOutlineSearch } from 'react-icons/ai'

const Navigation = () => {
  return (
    <nav className="nav s-flex-center">
      <header className="s-flex-center nav-header">
        <img className="nav-image" src={navCocktailParty} alt="" />
        <h2>Cocktail Recipes</h2>
        <div className="nav-underline"></div>
      </header>
      <div className="nav-link-container">
        <ul className="s-flex-center nav-links">
          <NavLink className={({isActive}) => isActive ? "nav-link nav-link-active" : "nav-link"} to="/" end>
            <AiFillHome /> <span className="nav-link-span">Homepage</span>
          </NavLink>
          <NavLink className={({isActive}) => isActive ? "nav-link nav-link-active" : "nav-link"} to="search">
            <AiOutlineSearch /> <span className="nav-link-span">Search</span>
          </NavLink>
          <NavLink className={({isActive}) => isActive ? "nav-link nav-link-active" : "nav-link"} to="favorites">
            <AiFillStar /> <span className="nav-link-span">Favorites</span>
          </NavLink>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
