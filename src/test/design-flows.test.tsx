import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosHeaders, type AxiosResponse } from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authFetch } from "../axios/authFetch";
import Navigation from "../components/Navigation";
import { CocktailProvider } from "../context/useContext";
import Favorites from "../pages/Favorites";
import Home from "../pages/Home";
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
  delete document.documentElement.dataset.theme;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("redesigned recipe flows", () => {
  it("searches and filters the collection by drink type", async () => {
    const user = userEvent.setup();
    const get = vi.spyOn(authFetch, "get").mockResolvedValue({
      data: { drinks: [cocktail, { ...cocktail, idDrink: "456", strDrink: "Virgin Margarita", strAlcoholic: "Non alcoholic" }] },
    });
    render(<MemoryRouter><Search /></MemoryRouter>);

    await user.type(screen.getByLabelText("COCKTAIL NAME"), "margarita");
    expect(await screen.findByRole("link", { name: /margarita/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /virgin margarita/i })).not.toBeInTheDocument();
    expect(get).toHaveBeenCalledWith("/search.php?s=margarita", expect.objectContaining({ signal: expect.any(AbortSignal) }));

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

  it("searches automatically only after typing pauses", async () => {
    vi.useFakeTimers();
    const get = vi.spyOn(authFetch, "get").mockResolvedValue({ data: { drinks: [cocktail] } });
    render(<MemoryRouter><Search /></MemoryRouter>);
    const input = screen.getByLabelText("COCKTAIL NAME");
    expect(screen.queryByRole("button", { name: "Search" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("SEARCH BY")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "gin" } });
    await act(async () => { await vi.advanceTimersByTimeAsync(399); });
    expect(get).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "gin fizz" } });
    await act(async () => { await vi.advanceTimersByTimeAsync(399); });
    expect(get).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("/search.php?s=gin%20fizz", expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(screen.getByRole("link", { name: /margarita/i })).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByText("Your next favorite is waiting.")).toBeInTheDocument();
    await act(async () => { await vi.advanceTimersByTimeAsync(400); });
    expect(get).toHaveBeenCalledTimes(1);
  });

  it("cancels old requests and ignores responses that arrive out of order", async () => {
    vi.useFakeTimers();
    let resolveFirst!: (response: AxiosResponse) => void;
    const first = new Promise<AxiosResponse>((resolve) => { resolveFirst = resolve; });
    const get = vi.spyOn(authFetch, "get")
      .mockReturnValueOnce(first)
      .mockResolvedValueOnce({ data: { drinks: [{ ...cocktail, idDrink: "456", strDrink: "Vodka Martini" }] } });
    render(<MemoryRouter><Search /></MemoryRouter>);
    const input = screen.getByLabelText("COCKTAIL NAME");

    fireEvent.change(input, { target: { value: "gin" } });
    await act(async () => { await vi.advanceTimersByTimeAsync(400); });
    const firstSignal = get.mock.calls[0][1]?.signal;
    fireEvent.change(input, { target: { value: "vodka" } });
    expect(firstSignal?.aborted).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(400); });
    expect(screen.getByRole("link", { name: /vodka martini/i })).toBeInTheDocument();

    await act(async () => {
      resolveFirst({
        data: { drinks: [cocktail] },
        status: 200,
        statusText: "OK",
        headers: {},
        config: { headers: new AxiosHeaders() },
      });
      await first;
    });
    expect(screen.getByRole("link", { name: /vodka martini/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /margarita/i })).not.toBeInTheDocument();
  });

  it("shows no matches for a name search and allows a new search", async () => {
    const user = userEvent.setup();
    vi.spyOn(authFetch, "get")
      .mockResolvedValueOnce({ data: { drinks: null } })
      .mockResolvedValueOnce({ data: { drinks: [cocktail] } });
    render(<MemoryRouter><Search /></MemoryRouter>);

    const input = screen.getByLabelText("COCKTAIL NAME");
    await user.type(input, "unavailable");
    expect(await screen.findByText("No matches this time.")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "lime");
    expect(await screen.findByRole("link", { name: /margarita/i })).toBeInTheDocument();
  });

  it("shows an error rather than crashing on unexpected search results", async () => {
    const user = userEvent.setup();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(authFetch, "get")
      .mockResolvedValueOnce({ data: { drinks: { error: "unexpected" } } })
      .mockResolvedValueOnce({ data: { drinks: [cocktail] } });
    render(<MemoryRouter><Search /></MemoryRouter>);

    await user.type(screen.getByLabelText("COCKTAIL NAME"), "margarita");
    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong");
    expect(log).toHaveBeenCalledWith("Cocktail search failed.", expect.any(Error));
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByRole("link", { name: /margarita/i })).toBeInTheDocument();
  });

  it("shuffles the home pick and can retry a failed request", async () => {
    const user = userEvent.setup();
    const get = vi.spyOn(authFetch, "get")
      .mockResolvedValueOnce({ data: { drinks: [cocktail] } })
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce({ data: { drinks: [{ ...cocktail, idDrink: "456", strDrink: "Daiquiri" }] } });
    render(<MemoryRouter><Home /></MemoryRouter>);

    expect(await screen.findByRole("link", { name: /margarita/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /pick another cocktail/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("couldn't load");
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByRole("link", { name: /daiquiri/i })).toHaveAttribute("href", "/cocktail/456");
    expect(get).toHaveBeenCalledTimes(3);
  });

  it("persists dark mode between mounts", async () => {
    const user = userEvent.setup();
    const view = render(<MemoryRouter><CocktailProvider><Navigation /></CocktailProvider></MemoryRouter>);
    const toggle = screen.getByRole("button", { name: "Dark mode" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("cocktail-theme")).toBe("dark");

    view.unmount();
    render(<MemoryRouter><CocktailProvider><Navigation /></CocktailProvider></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("uses the system theme until a saved choice overrides it", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const view = render(<MemoryRouter><CocktailProvider><Navigation /></CocktailProvider></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "true");
    view.unmount();

    localStorage.setItem("cocktail-theme", "light");
    render(<MemoryRouter><CocktailProvider><Navigation /></CocktailProvider></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "false");
  });
});
