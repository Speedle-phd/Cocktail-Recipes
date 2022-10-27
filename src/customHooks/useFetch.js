
import { useEffect, useState } from "react";
import { authFetch } from "../axios/authFetch";

const useFetch = (url) => {
 const [cocktail, setCocktail] = useState({})
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(false)

 const getData = async(url) => {
  try {
   setLoading(true)
   setError(false)
   const res = await authFetch(url)
   if(!res.status === 200) throw new Error()
   const {data} = res
   setCocktail(data)
   setLoading(false)
  } catch (error) {
   console.log(error);
   setError(true)
  }
 }

 useEffect(() => {
  getData(url)
 }, [])

 return {cocktail, loading, error}
}

export default useFetch