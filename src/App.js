import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import { displayToast } from "./helpers/toastHelper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import "./App.css";

function App() {
  // all state goes here
   const [recipes, setRecipes] = useState([]);
   const [selectedRecipe, setSelectedRecipe] = useState(null);
   const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   
   const [newRecipe, setNewRecipe] = useState(
    {
      title: "",
      ingredients: "",
      instructions: "",
      servings: 1, // conservative default
      description: "",
      image_url: ""
    //  image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
    });
   
   // console.log(selectedRecipe);

   //fetch the recipes
   useEffect (() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
      
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
    }  else {
          displayToast("Not able to retrieve recipe at this time. Please try again later.")
        }
      } catch (error) {
        displayToast("An error occured while fetching recipes,", error);
      }
      };
        fetchAllRecipes();
      },[]);

    // used to use the logo to reset the app
    const displayAlRecipes = () => {
      setSearchTerm("")
      setSelectedRecipe(null)
      setShowNewRecipeForm(false)
    };
    

    //adding of new recipes
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
           displayToast("Recipe added successfully!");
           
           setShowNewRecipeForm(false)
           setNewRecipe({
             title: "",
             ingredients: "",
             instructions: "",
             servings: 1,
             description: "",
             image_url: ""
             //image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
           });
          } else {
            displayToast("Oops - could not add recipe!");
      
          }
          } catch (e) {
            displayToast("The form did not work, sorry. No new recipe for you!", e)
          }
       };

   //editing recipes functionality
  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();

    const { id } = selectedRecipe;

  //  console.log("Selected Recipe:", selectedRecipe);
  //  console.log("Recipe ID:", id);
   
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
          displayToast("Recipe successfully updated");
        } else {
          displayToast("Failed to update recipe")
        }
    } catch (error) {
      displayToast("The recipe did not update, sorry.", e)
    }

    setSelectedRecipe(null);
  };

  //this is the update function for editing the recipes
  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
   
     if (action === "update") {
       setSelectedRecipe({...selectedRecipe, [name]: value});
     } else if (action === "new") {
       setNewRecipe({...newRecipe, [name]: value})
     }
 };  

  //for selecting and unselecting the recipes to make them full screen
const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
};

const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
};


//for showing and hiding the form to add new recipes
const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
};

const showRecipeForm = () => {
  setShowNewRecipeForm(true);
  setSelectedRecipe(null);
};


//for deleting recipes
const handleDeleteRecipe = async (recipeId) => {
  try {
    const response = await fetch(`/api/recipes/${recipeId}`, {
      method: "DELETE",
    });

      if (response.status === 200) {
         setRecipes(
         recipes.filter((recipe) => {
          return recipe.id !== recipeId;
      })
      );
      setSelectedRecipe(null) 
      console.log("Recipe successfully deleted");
      } else {
        console.error("Failed to delete recipe")
      }
  } catch (error) {
    console.error("Something went wrong during the request, sorry.", error)
  }
};

  //search handling section
  const updateSearchTerm = (e) => {
    setSearchTerm(e.target.value);
 };

 const handleSearch = () => {
  const searchResults = recipes.filter((recipe) => {
       const valuesToSearch = [recipe.title, recipe.ingredients, recipe.description];
       return valuesToSearch.some(value => value.toLowerCase().includes(searchTerm.toLowerCase())) 
  })
     return searchResults;
 };

 
// for only showing the recipes that show up in the search
   const displayedRecipes = searchTerm ? 
   handleSearch(searchTerm) : recipes;


  return (
    <div className='recipe-app'>
       <Header 
       showRecipeForm={showRecipeForm}
       searchTerm={searchTerm}
       updateSearchTerm={updateSearchTerm}
       displayAllRecipes={displayAlRecipes}
        />
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
        handleDeleteRecipe={handleDeleteRecipe}
      />
      )}
    {selectedRecipe === null && !showNewRecipeForm && (
    <div className="recipe-list">
      {displayedRecipes.map(recipe => (
        <RecipeExcerpt 
            key={recipe.id} 
            recipe={recipe} 
            handleSelectRecipe={handleSelectRecipe} 
        />
    ))}
        </div> 
    )}
    <ToastContainer/>
    </div>
  );
}

export default App;
