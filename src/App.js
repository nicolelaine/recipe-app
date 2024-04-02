import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

function App() {
   const [recipes, setRecipes] = useState([]);
   const [selectedRecipe, setSelectedRecipe] = useState(null);
   const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
   
   const [newRecipe, setNewRecipe] = useState(
    {
      title: "",
      ingredients: "",
      instructions: "",
      servings: 1, // conservative default
      description: "",
      image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
    });
   
    console.log(selectedRecipe);
   
   useEffect (() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
      
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
    }  else {
          console.log("Not able to retrieve recipe at this time. Please try again later.")
        }
      } catch (error) {
        console.error("An error occured while fetching recipes,", error);
      }
      };
        fetchAllRecipes();
      },[]);

  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });
        if (response.ok) {
           const data =  await response.json();
           setRecipes([...recipes, data.recipe]);    
           console.log("Recipe added successfully!");
           
           setShowNewRecipeForm(false)
           setNewRecipe({
             title: "",
             ingredients: "",
             instructions: "",
             servings: 1,
             description: "",
             image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
           });
          } else {
            console.error("Oops - could not add recipe!");
      
          }
          } catch (e) {
            console.error("The form did not work, sorry. No new recipe for you!", e)
          }
       };

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();

    const { id } = selectedRecipe;

    console.log("Selected Recipe:", selectedRecipe);
    console.log("Recipe ID:", id);
   
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });

        if (response.status === 200) {
           const data =  await response.json();
           setRecipes(
           recipes.map((recipe) => {
            if (recipe.id === id) {
             return data.recipe;
            }
          return recipe;
        })
        );
          console.log("Recipe successfully updated");
        } else {
          console.error("Failed to update recipe")
        }
    } catch (error) {
      console.error("The recipe did not update, sorry.", e)
    }

    setSelectedRecipe(null);
  };

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


  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
   
     if (action === "update") {
       setSelectedRecipe({...selectedRecipe, [name]: value});
     } else if (action === "new") {
       setNewRecipe({...newRecipe, [name]: value})
     }
 };  
 


  return (
    <div className='recipe-app'>
       <Header showRecipeForm={showRecipeForm} />
       {showNewRecipeForm && (
        <NewRecipeForm 
        hideRecipeForm={hideRecipeForm} 
        onUpdateForm={onUpdateForm} 
        newRecipe={newRecipe} 
        handleNewRecipe={handleNewRecipe} 
        />
       )}
      {selectedRecipe && (
      <RecipeFull 
        selectedRecipe={selectedRecipe} 
        handleUnselectRecipe={handleUnselectRecipe} 
        onUpdateForm={onUpdateForm}
        handleUpdateRecipe={handleUpdateRecipe}
      />
      )}
    {selectedRecipe === null && !showNewRecipeForm && (
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
