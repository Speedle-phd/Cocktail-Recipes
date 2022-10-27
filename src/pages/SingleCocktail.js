import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../customHooks/useFetch'
import {FaCocktail} from 'react-icons/fa'
import { useGlobalContext } from '../context/useContext'

const SingleCocktail = () => {
  const alertDisplay = useRef()
  const {addToFavorites} = useGlobalContext()
  let { cocktailId } = useParams()
  let {cocktail: {drinks}, loading, error} = useFetch(`/lookup.php?i=${cocktailId}`)

  if(error){
        return (
          <section className="section-center">
            <div className="single-cocktail-container s-flex-center">
              <h2>An Error Occurred - Please refresh the page</h2>
            </div>
          </section>
        )
  }

  if(loading) {
    return (
      <section className="section-center">
        <div className="single-cocktail-container s-flex-center">
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    )
  }
  if(drinks) {
    const {
      strDrink,
      strCategory,
      strAlcoholic,
      strGlass,
      strInstructions,
      strDrinkThumb,
      strIngredient1,
      strIngredient2,
      strIngredient3,
      strIngredient4,
      strIngredient5,
      strIngredient6,
      strIngredient7,
      strIngredient8,
      strIngredient9,
      strIngredient10,
      strIngredient11,
      strIngredient12,
      strIngredient13,
      strIngredient14,
      strIngredient15,
      strMeasure1,
      strMeasure2,
      strMeasure3,
      strMeasure4,
      strMeasure5,
      strMeasure6,
      strMeasure7,
      strMeasure8,
      strMeasure9,
      strMeasure10,
      strMeasure11,
      strMeasure12,
      strMeasure13,
      strMeasure14,
      strMeasure15,
    } = drinks[0]
    let ingredients = [
      strIngredient1,
      strIngredient2,
      strIngredient3,
      strIngredient4,
      strIngredient5,
      strIngredient6,
      strIngredient7,
      strIngredient8,
      strIngredient9,
      strIngredient10,
      strIngredient11,
      strIngredient12,
      strIngredient13,
      strIngredient14,
      strIngredient15,
    ]
    let measures = [
      strMeasure1,
      strMeasure2,
      strMeasure3,
      strMeasure4,
      strMeasure5,
      strMeasure6,
      strMeasure7,
      strMeasure8,
      strMeasure9,
      strMeasure10,
      strMeasure11,
      strMeasure12,
      strMeasure13,
      strMeasure14,
      strMeasure15,
    ]
        return (
          <section className="section-center">
            <div className="single-cocktail-container s-flex-center">
              <div className="single-cocktail-header">
                <h2>{strDrink}</h2>
                <div className="single-cocktail-underline"></div>
              </div>
              <div className="general-info">
                <p>{strAlcoholic}</p>
                <p>{strCategory}</p>
              </div>
              <article className="single-cocktail-info s-flex-center">
                <div className="single-cocktail-image-container">
                  <div className="image-wrapper s-flex-center">
                    <img
                      className="single-cocktail-image"
                      src={strDrinkThumb}
                      alt={strDrink}
                    />
                  </div>
                </div>
                <div className="preparation-container">
                  <div className="ingredients-prep">
                    <ul className="igredients-list">
                      {ingredients.map((e, index) => {
                        if (e === null) return
                        return (
                          <li className="single-ingredient" key={index}>
                            <FaCocktail />
                            <span className="igrendient">{e}</span>
                            <span className="measure">{measures[index]}</span>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="preparation-instructions">
                      <p>{strInstructions}</p>
                    </div>
                    <div className="serve-in">
                      Best served in:
                      <br />
                      <span>{strGlass}</span>
                    </div>
                  </div>
                </div>
              </article>
              <button onClick={() => {
                alertDisplay.current.classList.add('show')
                setTimeout(() => {
                  if(alertDisplay.current.matches('.show')) {
                  alertDisplay.current.classList.remove('show')
                  }
                }, 3000)
                addToFavorites(drinks[0])
              }} className="fav-btn">
                Add to Favorites
                <div ref={alertDisplay} className="fav-alert">
                  Added to Favorites sucessfully
                </div>
              </button>
            </div>
          </section>
        )
  }
}

export default SingleCocktail
