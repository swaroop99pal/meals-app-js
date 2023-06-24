const inputField = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-icon');
const mealContent = document.querySelector('.meal');
const popupContainer = document.querySelector('.pop-up-container');
const closePopup = document.querySelector('.pop-up > i');
const popupContent = document.querySelector('.pop-up-inner');


// Fetches the Meal upon search
async function searchedMeals(e) {
  const fetchMeal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${e}`
  );
  const fetchedData = await fetchMeal.json();
  const meals = fetchedData.meals;

  return meals;
}

// Performs Search Meal Operation
searchButton.addEventListener('click', async () => {
  mealContent.innerHTML = '';
  const targetValue = inputField.value;
  const meals = await searchedMeals(targetValue);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
    document.querySelector('.meals-container > h2').innerText =
      'Search Results:';
  } else {
    document.querySelector('.meals-container > h2').innerText =
      'No Meals Found, try something else';
    mealContent.innerHTML = '';
  }
});

// Function to Add Meal Searched by User
function addMeal(meal) {
  const mealCard = document.createElement('div');
  mealCard.classList.add('meal-card');
  mealCard.innerHTML = `
        <div class="meal-card-img-container">
            <img
            src="${meal.strMealThumb}"
            />
        </div>
        <div class="meal-name">
            <p>${meal.strMeal}</p>
            <i class="fa-regular fa-heart"></i>
        </div>`;

  const addToFav = mealCard.querySelector('.fa-heart');
  addToFav.addEventListener('click', () => {
    // It is used to check  if the meal added has favourite icon(fa-heart) is clicked or not
    if (addToFav.classList.contains('fa-regular')) {
      addToFav.setAttribute('class', 'fa-solid fa-heart');
      addToLS(meal.idMeal);
    } else {
      addToFav.setAttribute('class', 'fa-regular fa-heart');
      removeFromLS(meal.idMeal);
    }
  });

  mealContent.appendChild(mealCard);
  mealCard.firstChild.nextSibling.addEventListener('click', () => {
    showMealPopup(meal);
  });
}

// Fetches the Meal from the Local Storage
function getMeals() {
  const mealIDs = JSON.parse(localStorage.getItem('mealIDs'));

  return mealIDs === null ? [] : mealIDs;
}

// Add Meal to the Local Storage
function addToLS(mealID) {
  const mealIDs = getMeals();
  localStorage.setItem('mealIDs', JSON.stringify([...mealIDs, mealID]));
}

// Remove Meal from Local Storage
function removeFromLS(mealID) {
  const mealIDs = getMeals();
  localStorage.setItem(
    'mealIDs',
    JSON.stringify(mealIDs.filter((id) => id !== mealID))
  );
}

// Displays the Meal Details in Modal
function showMealPopup(meal) {
  popupContent.innerHTML = '';

  const newPopup = document.createElement('div');
  newPopup.classList.add('pop-up-inner');

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  newPopup.innerHTML = `<div class="left">
  <div class="meal-card">
    <div class="meal-card-img-container">
      <img
        src="${meal.strMealThumb}"
      />
    </div>
    <div class="meal-name">
      <p>${meal.strMeal}</p>
      <i class="fa-regular fa-heart"></i>
    </div>
  </div>
  <div class="watch-link">
  <a href="${meal.strYoutube}" target="_blank">
  <button type="button" class="btn">
  Watch Recipe
  </button>
  </a>
  </div>
</div>
<div class="right">
  <div>
    <h2>Instructions</h2>
    <p class="meal-info">
     ${meal.strInstructions}
    </p>
  </div>
  <div>
    <h2>Ingredients / Measures</h2>
    <ul>
      ${ingredients.map((e) => `<li>${e}</li>`).join('')}
    </ul>
  </div>
</div>`;

  popupContent.appendChild(newPopup);
  popupContainer.style.display = 'flex';
}

// Close the popupContent Modal
closePopup.addEventListener('click', () => {
  popupContainer.style.display = 'none';
});

