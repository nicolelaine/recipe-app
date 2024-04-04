import React from "react";
import { truncateText } from "../helpers/utils";


const RecipeExcerpt = ({recipe, handleSelectRecipe}) => {
  console.log("Recipe description:", recipe.description);
   const truncatedDescription = truncateText(recipe.description, 20);
  console.log("Truncated description:", truncatedDescription);
   return (
    <article className="recipe-card">
        <figure>
            <img src={recipe.image_url} alt={recipe.title}/>
        </figure>
        <h2>{recipe.title}</h2>
        <p className="flex-spacing">Description: {truncatedDescription}</p>
        <button onClick={() => handleSelectRecipe(recipe)}>View</button>
    </article>
  );
};

export default RecipeExcerpt;
