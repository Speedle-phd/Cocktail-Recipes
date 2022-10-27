import React, { useEffect, useState } from 'react'
import useFetch from '../customHooks/useFetch'
import { Link } from 'react-router-dom'
import CocktailTeaser from '../components/CocktailTeaser'

const Home = () => {
  const [data, setData] = useState([])
  const {cocktail: {drinks}, loading , error} = useFetch('/random.php')
  
  console.log(drinks, loading, error);

  if(error) {
    return (
      <section className="section-center">
        <div className="section-container s-flex-center">
          <header className="home-header">
            <h3>An error occurred - Please refresh the page.</h3>
          </header>
        </div>
      </section>
    )
  }

  if(loading) {
    return (
      <>
        <section className="section-center">
          <div className="section-container s-flex-center">
            <header className="home-header">
              <h3>Get a random cocktail for starters</h3>
            </header>
          </div>
          <div className="s-flex-center loading">
            <div className="loading-spinner"></div>
          </div>
        </section>
      </>
    )
  }
  if(drinks)
  return (
    <>
      <section className="section-center">
        <div className="section-container s-flex-center">
          <header className="home-header">
            <h3>Get a random cocktail for starters</h3>
          </header>
        </div>
        <CocktailTeaser {...drinks[0]}/>
      </section>
    </>
  )
}

export default Home
