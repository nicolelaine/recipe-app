import React from "react";
import Header from "./components/Header";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";

function App() {
   const [recipes, setRecipes] = useState([])
   const [selectedRecipe, setSelectedRecipe] = useState(null)

   const fetchAllRecipes = async () => {
      try {
        const response = await fetch ('/api/recipes');
        const result = await response.json();
      
        if (response.ok) {
          setRecipes(result);
    } 
       else {
          console.log("Not able to retrieve recipe at this time. Please try again later.")
        }
      } catch (error) {
        console.error("An error accord while fetching recipes,", error);
      }
      };


  useEffect (() => {
        fetchAllRecipes();
      },[]);


  const handleSelectRecipe = (recipe) => {
      setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
      setSelectedRecipe(null);
  };

  return (
    <div className='recipe-app'>
       <Header />
      {selectedRecipe && (
      <RecipeFull 
        selectedRecipe={selectedRecipe} 
        handleUnselectRecipe={handleUnselectRecipe} 
      />
      )}
    {selectedRecipe === null && (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeExcerpt 
            key={recipe.id} 
            recipe={recipe} 
            handleSelectRecipe={handleSelectRecipe} 
        />
    ))}
        </div> 
    )}
    </div>
  );
}

export default App;
