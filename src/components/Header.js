import React from "react";
import { Search } from "react-feather";
import { ReactComponent as Logo } from "../images/utensils.svg";
import NewRecipeForm from "./NewRecipeForm";

const Header = ({showRecipeForm, searchTerm, updateSearchTerm, displayAllRecipes}) => {
  return (
    <header>
      <div className='logo-search'>
        <Logo onClick={displayAllRecipes} />
        <div className='search'>
          <label className='visually-hidden' htmlFor='search'>
            Search
          </label>
          <input type='text' value={searchTerm} placeholder='Search' id='search' onChange={(e) => updateSearchTerm(e)} />
          <Search />
        </div>
      </div>
      <h1>My Favorite Recipes</h1>
      <button className="new-recipe" onClick={showRecipeForm}>Add New Recipe</button>
    </header>
  );
};

export default Header;
