
const mealContent = document.querySelector('.meal');

// Accessing the favourite meal container
const MealContainer = document.querySelector('.fav-meals');

// Accessing the pop-up container variables
const popupContainer = document.querySelector('.pop-up-container');
const closePopup = document.querySelector('.pop-up > i');
const popupContent = document.querySelector('.pop-up-inner');

fetchFavMeals();

// Fetches the Meal from Local Storage
function getMeals() {
  const mealIDs = JSON.parse(localStorage.getItem('mealIDs'));

  return mealIDs === null ? [] : mealIDs;
}

// Fetches the Meal based on the ID associated with it
async function getMealById(id) {
  const fetchMeal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const fetchedData = await fetchMeal.json();
  const meal = fetchedData.meals[0];

  return meal;
}

// to fetch favourite Meals
async function fetchFavMeals() {
  MealContainer.innerHTML = '';
  const mealIDs = getMeals();
  const meals = [];
  for (let i = 0; i < mealIDs.length; i++) {
    const mealID = mealIDs[i];
    let meal = await getMealById(mealID);
    addMealToFav(meal);
    meals.push(meal);
  }
}

// Adding Meals to Favourites Page upon click on heart Icon from Home Page
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
    if (mealCard.classList.contains('fa-regular')) {
      mealCard.setAttribute('class', 'fa-solid fa-heart');
      addToLS(meal.idMeal);
    } else {
      addToFav.setAttribute('class', 'fa-regular fa-heart');
      removeFromLS(meal.idMeal);
    }
    fetchFavMeals();
  });
  mealContent.appendChild(mealCard);
}

// Function to add Meal to Favourites page
function addMealToFav(meal) {
  const fav_meals = document.createElement('div');
  fav_meals.innerHTML = `
    <div class="single">
        <div class="top">
            <div class="img-container">
                <img
                src="${meal.strMealThumb}"
                />
            </div>
            <div class="text">
                <p>${meal.strMeal}</p>
            </div>
        </div>
        <i class="fa-solid fa-x"></i>
    </div>`;

  const x = fav_meals.querySelector('.fa-x');

  x.addEventListener('click', () => {
    removeFromLS(meal.idMeal);

    const heart_btns = document.querySelectorAll('.fa-heart');
    heart_btns.forEach((heart_btn) => {
      heart_btn.setAttribute('class', 'fa-regular fa-heart');
    });
    fetchFavMeals();
  });

  fav_meals.firstChild.nextSibling.firstChild.nextSibling.addEventListener(
    'click',
    () => {
      showMealPopup(meal);
    }
  );

  MealContainer.appendChild(fav_meals);
}

// Remove the favourite Meals
function removeFromLS(mealID) {
  const mealIDs = getMeals();
  localStorage.setItem(
    'mealIDs',
    JSON.stringify(mealIDs.filter((id) => id !== mealID))
  );
}

// Closes the Pop-up Modal
closePopup.addEventListener('click', () => {
  popupContainer.style.display = 'none';
});

// Displays the Meal Details
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
      <button type="button" class="btn btn-outline-success">
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