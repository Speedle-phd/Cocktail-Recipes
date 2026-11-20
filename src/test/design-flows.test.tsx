import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authFetch } from "../axios/authFetch";
import { CocktailProvider } from "../context/useContext";
import Favorites from "../pages/Favorites";
import Search from "../pages/Search";
import SingleCocktail from "../pages/SingleCocktail";
import type { Cocktail } from "../types";

const cocktail: Cocktail = {
  idDrink: "123",
  strDrink: "Margarita",
  strDrinkThumb: "https://example.com/margarita.jpg",
  strAlcoholic: "Alcoholic",
  strCategory: "Ordinary Drink",
  strGlass: "Cocktail glass",
  strInstructions: "Shake and serve.",
  strIngredient1: "Tequila",
  strMeasure1: "1 oz",
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("redesigned recipe flows", () => {
  it("searches and filters the collection by drink type", async () => {
    const user = userEvent.setup();
    const get = vi.spyOn(authFetch, "get").mockResolvedValue({
      data: { drinks: [cocktail, { ...cocktail, idDrink: "456", strDrink: "Virgin Margarita", strAlcoholic: "Non alcoholic" }] },
    });
    render(<MemoryRouter><Search /></MemoryRouter>);

    await user.type(screen.getByLabelText("COCKTAIL NAME"), "margarita");
    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(await screen.findByRole("link", { name: /margarita/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /virgin margarita/i })).not.toBeInTheDocument();
    expect(get).toHaveBeenCalledWith("/search.php?s=margarita");

    await user.selectOptions(screen.getByLabelText("DRINK TYPE"), "Non alcoholic");
    expect(screen.getByRole("link", { name: /virgin margarita/i })).toBeInTheDocument();
  });

  it("saves and removes a recipe from favorites", async () => {
    const user = userEvent.setup();
    vi.spyOn(authFetch, "get").mockResolvedValue({ data: { drinks: [cocktail] } });
    render(
      <MemoryRouter initialEntries={["/cocktail/123"]}>
        <CocktailProvider>
          <Routes>
            <Route path="/cocktail/:cocktailId" element={<SingleCocktail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </CocktailProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Tequila")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /save to favorites/i }));
    expect(screen.getByRole("button", { name: /saved to favorites/i })).toHaveAttribute("aria-pressed", "true");
    await waitFor(() => expect(JSON.parse(localStorage.getItem("cocktailLS") ?? "[]")).toHaveLength(1));
    await user.click(screen.getByRole("button", { name: /saved to favorites/i }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem("cocktailLS") ?? "[]")).toHaveLength(0));
  });
});
