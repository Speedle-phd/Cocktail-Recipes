import React, { useEffect, useRef, useState } from 'react'
import { authFetch } from '../axios/authFetch'
import CocktailTeaser from '../components/CocktailTeaser'

let globalData = null;

const Search = () => {
  const [alcoholic, setAlcoholic] = useState(true)
  const alcoholicRef = useRef()
  const [cocktail, setCocktail] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const searchRef = useRef()

  const getSearchData = async() => {
    try {
      setLoading(true)
      setError(false)
      const res = await authFetch(`/search.php?s=${searchRef.current.value}`)
      if (!res.status === 200) throw new Error()
      const {data: {drinks}} = res
      globalData = drinks
      setCocktail(globalData.filter(e => e.strAlcoholic === alcoholicRef.current.value))
      setLoading(false)
      console.log(cocktail, loading, error, alcoholicRef.current.value);
    } catch (error) {
      console.log(error)
      setError(true)
    }
  }

  const SubmitHandle = (evt) =>{
    evt.preventDefault();
    getSearchData()
  }
  useEffect(() => {
    if(!globalData) return
    setCocktail(globalData.filter(e => e.strAlcoholic === alcoholicRef.current.value))
    console.log(cocktail)
  }, [alcoholic])

  if(loading){
    return (
      <>
        <section className="section-center">
          <div className="section-container">
            <div className="form-container s-flex-center">
              <form className="form s-flex-center" onSubmit={SubmitHandle}>
                <h2>Search for any cocktails...</h2>
                <div className="form-control">
                  <input
                    className="input-search"
                    type="text"
                    name="name"
                    id="name"
                    ref={searchRef}
                    required
                  />
                  <select
                    onChange={() => {
                      setAlcoholic(!alcoholic)
                    }}
                    className="select-search"
                    ref={alcoholicRef}
                    name="alcoholic"
                    id="alcoholic"
                  >
                    <option value="Alcoholic">Alkoholisch</option>
                    <option value="Non alcoholic">Nicht alkoholisch</option>
                  </select>
                </div>
                <button type="submit" className="fav-btn">
                  Search for Cocktails
                </button>
                <div className="s-flex-center loading">
                  <div className="loading-spinner"></div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </>
    )
  }
  if(error){
    return (
      <>
        <section className="section-center">
          <div className="section-container">
            <div className="form-container s-flex-center">
              <form className="form s-flex-center" onSubmit={SubmitHandle}>
                <h2>Search for any cocktails...</h2>
                <div className="form-control">
                  <input
                    className="input-search"
                    type="text"
                    name="name"
                    id="name"
                    ref={searchRef}
                    required
                  />
                  <select
                    onChange={() => {
                      setAlcoholic(!alcoholic)
                    }}
                    className="select-search"
                    ref={alcoholicRef}
                    name="alcoholic"
                    id="alcoholic"
                  >
                    <option value="Alcoholic">Alkoholisch</option>
                    <option value="Non alcoholic">Nicht alkoholisch</option>
                  </select>
                </div>
                <button type="submit" className="fav-btn">
                  Search for Cocktails
                </button>
                <h3>An error occurred. Please refresh the page.</h3>
              </form>
            </div>
          </div>
        </section>
      </>
    )
  }

  if (cocktail.length === 0) {
    return (
      <>
        <section className="section-center">
          <div className="section-container">
            <div className="form-container s-flex-center">
              <form className="form s-flex-center" onSubmit={SubmitHandle}>
                <h2>Search for any cocktails...</h2>
                <div className="form-control">
                  <input
                    className="input-search"
                    type="text"
                    name="name"
                    id="name"
                    ref={searchRef}
                    required
                  />
                  <select
                    onChange={() => {
                      setAlcoholic(!alcoholic)
                    }}
                    className="select-search"
                    ref={alcoholicRef}
                    name="alcoholic"
                    id="alcoholic"
                  >
                    <option value="Alcoholic">Alkoholisch</option>
                    <option value="Non alcoholic">Nicht alkoholisch</option>
                  </select>
                </div>
                <button type="submit" className="fav-btn">
                  Search for Cocktails
                </button>
                <h3 className="empty-arr-alert">Either you haven't searched anything yet or your search doesn't match any cocktail</h3>
              </form>
            </div>
          </div>
        </section>
      </>
    )
  }
  if(cocktail.length > 0) {
    return (
      <>
        <section className="section-center">
          <div className="section-container">
            <div className="form-container s-flex-center">
              <form className="form s-flex-center" onSubmit={SubmitHandle}>
                <h2>Search for any cocktails...</h2>
                <div className="form-control">
                  <input
                    className="input-search"
                    type="text"
                    name="name"
                    id="name"
                    ref={searchRef}
                    required
                  />
                  <select onChange={() => {setAlcoholic(!alcoholic)}} className="select-search" ref={alcoholicRef} name="alcoholic" id="alcoholic">
                    <option value="Alcoholic">Alkoholisch</option>
                    <option value="Non alcoholic">Nicht alkoholisch</option>
                  </select>
                </div>
                <button type="submit" className="fav-btn">
                  Search for Cocktails
                </button>
                <div className="cocktails-search-container s-flex-center">
                {cocktail.sort((a, b) => a.strDrink < b.strDrink).map((e, index) => {
                  return (
                    <div key={index} className="single-search-item">
                      <CocktailTeaser {...e} />
                    </div>
                  )
                })}
                </div>
              </form>
            </div>
          </div>
        </section>
      </>
    )
  }

}

export default Search
