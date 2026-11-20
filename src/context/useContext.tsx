import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Cocktail } from "../types";

interface CocktailContextValue {
  favorites: Cocktail[];
  addToFavorites: (cocktail: Cocktail) => void;
  removeFromFavorites: (idDrink: string) => void;
}

const CocktailContext = createContext<CocktailContextValue | undefined>(
  undefined,
);

function isCocktail(value: unknown): value is Cocktail {
  if (typeof value !== "object" || value === null) return false;

  const cocktail = value as Record<string, unknown>;
  return (
    typeof cocktail.idDrink === "string" &&
    typeof cocktail.strDrink === "string" &&
    typeof cocktail.strDrinkThumb === "string" &&
    [cocktail.strAlcoholic, cocktail.strCategory, cocktail.strGlass, cocktail.strInstructions]
      .every((field) => typeof field === "string" || field === null)
  );
}

function getStoredFavorites(): Cocktail[] {
  const storedFavorites = localStorage.getItem("cocktailLS");
  if (!storedFavorites) return [];

  try {
    const parsed: unknown = JSON.parse(storedFavorites);
    return Array.isArray(parsed) ? parsed.filter(isCocktail) : [];
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
}

const CocktailProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState<Cocktail[]>(getStoredFavorites);

  const addToFavorites = (cocktail: Cocktail) => {
    setFavorites((previousFavorites) =>
      previousFavorites.some(
        (favorite) => favorite.idDrink === cocktail.idDrink,
      )
        ? previousFavorites
        : [...previousFavorites, cocktail],
    );
  };

  const removeFromFavorites = (idDrink: string) => {
    setFavorites((previousFavorites) =>
      previousFavorites.filter((favorite) => favorite.idDrink !== idDrink),
    );
  };

  useEffect(() => {
    localStorage.setItem("cocktailLS", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <CocktailContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites }}
    >
      {children}
    </CocktailContext.Provider>
  );
};

export const useGlobalContext = (): CocktailContextValue => {
  const context = useContext(CocktailContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a CocktailProvider.");
  }
  return context;
};

export { CocktailProvider, CocktailContext };