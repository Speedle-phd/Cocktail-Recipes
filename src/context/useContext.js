import { useContext, useEffect, useState } from 'react'
import React from 'react'

const CocktailContext = React.createContext()

const CocktailProvider = ({children}) => {
 const [favorites, setFavorites] = useState((prev) => {
  const jsonData = JSON.parse(localStorage.getItem("cocktailLS"))
  if(!jsonData) return [] 
  return JSON.parse(localStorage.getItem("cocktailLS"))
 })
 const addToFavorites = (data) => {
  setFavorites((prev) => {
   const uniqueValues = prev.reduce((total, curr) => {
    const checkId = total.find(e => e.idDrink === curr.idDrink)
    if(checkId) return total
    total = [...total, curr]
    return total
   }, [])
   const filterValue = uniqueValues.filter(e => e.idDrink === data.idDrink)
   console.log(filterValue, [...prev])
   if (filterValue.length !== 0) return [...prev]
   console.count()
   const newFavorites = [...prev, data]
   return newFavorites
  })
 }
 const removeFromFavorites = (data) => {
  setFavorites((prev) => {
   return prev.filter(e => e.idDrink !== data)
  })
 }
 useEffect(() => {
  localStorage.setItem("cocktailLS", JSON.stringify(favorites))
 }, [favorites])

 return (
  <CocktailContext.Provider value={{favorites, addToFavorites, removeFromFavorites}}>
   {children}
  </CocktailContext.Provider>
 )


}
export const useGlobalContext = () => {
 return useContext(CocktailContext)
}
export {CocktailProvider, CocktailContext}