import React, { useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '../context/useContext'
import CocktailTeaser from '../components/CocktailTeaser'

const Favorites = () => {
  const {favorites, removeFromFavorites} = useGlobalContext()
  const [favGallery, setFavGallery] = useState(favorites);
  const favoriteRef = useRef();
  const logEvent = () => {
    if(favoriteRef.current.value.length === 0) {
      setFavGallery(favorites)
    } else if (favoriteRef.current.value.length > 0) {
      setFavGallery(() => favorites.filter(e => e.strDrink.toLowerCase().includes(favoriteRef.current.value.toLowerCase())))
    }
  }
  useEffect(() => {
    setFavGallery(favorites)
  },[favorites])

  if(favGallery.length === 0) {
    return (
      <>
        <section className="section-center">
          <div className="section-container">
            <div className="search-form s-flex-center">
              <input
                ref={favoriteRef}
                onChange={() => logEvent()}
                type="text"
                className="fav-input"
                placeholder="search your favorite drinks..."
              />
            </div>
            <h4 className="no-result-fav">
              You haven't picked any favorite drinks yet or your search wasn't
              matching any of your drinks.
            </h4>
          </div>
        </section>
      </>
    )
  }
  if(favGallery.length > 0) {
    return (
      <>
        <section className="section-center">
          <div className="section-container">
            <div className="search-form s-flex-center">
              <input ref={favoriteRef} onChange={() => logEvent()} type="text" className="fav-input" placeholder='search your favorite drinks...' />
            </div>
            <div className="favorite-drinks-container s-flex-center">
              {favGallery.map((e, index) => {
                return (
                  <div key={index} className="single-fav-container 
                  s-flex-center">
                    <div data-id={e.idDrink} className="single-fav-cocktail">
                      <CocktailTeaser {...e} />
                    </div>
                    <button className="fav-btn" onClick={() => {
                      removeFromFavorites(e.idDrink)
                      }}>
                        Remove from Favorites</button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </>
    )
  }
}

export default Favorites
