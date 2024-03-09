import React from "react";
import Header from "./components/Header";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import RecipeExcerpt from "./components/RecipeExcerpt";

function App() {
   const [recipes, setRecipes] = useState([])

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

  return (
    <div className='recipe-app'>
        <div className="recipe-list">
              {recipes.map(recipe => (
              <RecipeExcerpt key={recipe.id} recipe={recipe} />
               ))}
        </div> 
      <Header />
      <p>Your recipes here! </p>
    </div>
  );
}

export default App;
