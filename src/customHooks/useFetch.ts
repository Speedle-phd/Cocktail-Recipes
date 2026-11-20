
import { useEffect, useState } from "react";
import { authFetch } from "../axios/authFetch";
import type { CocktailResponse } from "../types";

const useFetch = (url: string) => {
  const [cocktail, setCocktail] = useState<CocktailResponse>({ drinks: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    let active = true;

    const getData = async () => {
      setLoading(true);
      setError(false);

      try {
        const { data } = await authFetch.get<CocktailResponse>(url);
        if (active) setCocktail(data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    void getData();
    return () => {
      active = false;
    };
  }, [url, requestNumber]);

  const refetch = () => {
    setLoading(true);
    setError(false);
    setRequestNumber((previous) => previous + 1);
  };

  return { cocktail, loading, error, refetch };
};

export default useFetch;