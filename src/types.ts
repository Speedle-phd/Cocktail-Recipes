export interface CocktailSummary {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strAlcoholic?: string | null;
  strCategory?: string | null;
}

export interface Cocktail extends CocktailSummary {
  [key: string]: string | null;
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strAlcoholic: string | null;
  strCategory: string | null;
  strGlass: string | null;
  strInstructions: string | null;
}

export interface CocktailResponse {
  drinks: Cocktail[] | null;
}
