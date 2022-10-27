import React from 'react'
import { Link } from 'react-router-dom'

const cocktailTeaser = ({ strCategory , strDrink, strDrinkThumb, idDrink, strAlcoholic}) => {
return (
 <article className="random-cocktail s-flex-center">
   <Link className='random-cocktail-link' to={`/cocktail/${idDrink}`}>
     <div className="random-cocktail-img-container">
      <img
        className="random-cocktail-img"
        src={strDrinkThumb}
        alt={strDrink}
      />
     </div>
     <h2 className='random-cocktail-name'>{strDrink}</h2>
     <div className="cocktail-attributes">
       <ul>
         <li className="cocktail-attribute">{strCategory}</li>
         <li className="cocktail-attribute">{strAlcoholic}</li>
       </ul>
     </div>
   </Link>
 </article>
) 
}

export default cocktailTeaser
