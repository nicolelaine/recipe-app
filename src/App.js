import React from "react";
import Header from "./components/Header";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";

function App() {
   const [recipes, setRecipes] = useState([])
   const [selectedRecipe, setSelectedRecipe] = useState(null)
   const [newRecipe, setNewRecipe] = useState(
    {
      title: "",
      ingredients: "",
      instructions: "",
      servings: 1, // conservative default
      description: "",
      image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
    });
    const [showNewRecipeForm, setShowNewRecipeForm] = useState (false)
   
   

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

  const hideRecipeForm = () => {
      setShowNewRecipeForm(false);
  };

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  };

  const onUpdateForm = (e) => {
     const { name, value } = e.target;
     setNewRecipe({...newRecipe, [name]: value});
  };   

  return (
    <div className='recipe-app'>
       <Header showRecipeForm={showRecipeForm} />
       {showNewRecipeForm && 
        <NewRecipeForm hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} newRecipe={newRecipe} />
       }
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
