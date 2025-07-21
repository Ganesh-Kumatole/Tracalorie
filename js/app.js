class CalorieTracker {
  constructor(calLimit) {
    this._calorieLimit = calLimit;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCalorieLimit(this._calorieLimit);
    this._displayCaloriesRemaining();
  }

  // Public methods

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._displayNewMeal(meal);
    this._renderState();
  }

  removeMeal(id) {
    this._meals.forEach((meal, index) => {
      if (meal.id === id) {
        this._totalCalories -= meal.calories;
        this._meals.splice(index, 1);
      }
    });

    this._renderState();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._displayNewWorkout(workout);
    this._renderState();
  }

  removeWorkout(id) {
    this._workouts.forEach((workout, index) => {
      if (workout.id === id) {
        this._totalCalories += workout.calories;
        this._workouts.splice(index, 1);
      }
    });

    this._renderState();
  }

  setLimit(e) {
    e.preventDefault();

    const limitInput = document.getElementById("limit");
    const calorieTarget = document.getElementById("calories-limit");

    calorieTarget.innerText = limitInput.value;

    const limitModal = document.getElementById("limit-modal");
    limitModal.setAttribute("aria-hidder", true);

    limitInput.value = "";
  }

  // Private methods

  _displayCalorieLimit(calLimit) {
    document.getElementById("calories-limit").innerText = calLimit;
  }

  _displayNetCalories() {
    document.getElementById("calories-total").innerText = this._totalCalories;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEle = document.getElementById("calories-consumed");

    const caloriesConsumed = this._meals.reduce((sum, currentMeal) => {
      sum += currentMeal.calories;
      return sum;
    }, 0);

    caloriesConsumedEle.innerText = caloriesConsumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEle = document.getElementById("calories-burned");

    const caloriesBurned = this._workouts.reduce((sum, currentWorkout) => {
      sum += currentWorkout.calories;
      return sum;
    }, 0);

    caloriesBurnedEle.innerText = caloriesBurned;
  }

  _displayCaloriesRemaining() {
    document.getElementById("calories-remaining").innerText =
      this._calorieLimit - this._totalCalories;
  }

  _displayCalorieProgress() {
    const progressBar = document.getElementById("calorie-progress");
    const caloriesRemainingCard = document.querySelector("div.alert-bg");

    const caloriesRemaining = this._calorieLimit - this._totalCalories;

    if (this._totalCalories <= 0) {
      progressBar.style.width = "0%";
    } else {
      const progressPercent = (this._totalCalories / this._calorieLimit) * 100;
      const width = Math.min(progressPercent, 100);
      progressBar.style.width = `${width}%`;
    }

    if (caloriesRemaining <= 0) {
      caloriesRemainingCard.classList.add("bg-danger");
      progressBar.classList.remove("bg-success");
      progressBar.classList.add("bg-danger");
    }
  }

  _displayNewMeal(meal) {
    const mealItemsList = document.getElementById("meal-items");
    const div = document.createElement("div");
    div.className = "card my-2";
    div.setAttribute("data-id", meal.id);

    div.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
            ${meal.calories} 
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;

    mealItemsList.append(div);
  }

  _displayNewWorkout(workout) {
    const workoutItemsList = document.getElementById("workout-items");
    const div = document.createElement("div");
    div.className = "card my-2";
    div.setAttribute("data-id", workout.id);

    div.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"> 
            ${workout.calories} 
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;

    workoutItemsList.append(div);
  }

  _renderState() {
    this._displayCalorieLimit(this._calorieLimit);
    this._displayNetCalories();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
  }
}

class Meal {
  constructor(name, cal) {
    this.id = Math.random().toString().slice(2, 7);
    this.name = name;
    this.calories = cal;
  }
}

class Workout {
  constructor(name, cal) {
    this.id = Math.random().toString().slice(2, 7);
    this.name = name;
    this.calories = cal;
  }
}

class AppInit {
  constructor() {
    this._tracker = new CalorieTracker(1500);

    /* Todos...
    // 01. Reset App
    // 02. Set Calorie Limit
    // 03. Add newItem to list
    // 04. Delete an Item from list
    // 05. Filter
    // 06. Tweak design a bit.
    */

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .getElementById("save")
      .addEventListener("click", this._setLimit.bind(this));

    document
      .getElementById("meal-form")
      .addEventListener("submit", this._addNewItem.bind(this, "meal"));

    document
      .getElementById("workout-form")
      .addEventListener("submit", this._addNewItem.bind(this, "workout"));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));

    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("input", this._filterItems.bind(this, "meal"));

    document
      .getElementById("filter-workouts")
      .addEventListener("input", this._filterItems.bind(this, "workout"));
  }

  _setLimit(e) {
    e.preventDefault();

    const calorieLimitInput = document.getElementById("limit");

    if (calorieLimitInput.value === "") {
      alert("Daily Calorie Limit cannot be Empty!");
      return;
    }

    this._tracker._calorieLimit = calorieLimitInput.value;

    const limitModalEle = document.getElementById("limit-modal");
    bootstrap.Modal.getInstance(limitModalEle).hide();

    this._tracker._renderState();

    // Note: Check why not reset needed?
  }

  _reset(e) {
    this._tracker._totalCalories = 0;
    this._tracker._meals = [];
    this._tracker._workouts = [];
    this._tracker._renderState();

    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";

    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
  }

  _addNewItem(type, e) {
    e.preventDefault();

    const itemName = document.getElementById(`${type}-name`);
    const itemCalories = document.getElementById(`${type}-calories`);

    // Validate input fields
    if (itemName.value === "" || itemCalories.value === "") {
      alert("Please enter all the fields");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(itemName.value, +itemCalories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(itemName.value, +itemCalories.value);
      this._tracker.addWorkout(workout);
    }

    itemName.value = "";
    itemCalories.value = "";

    const itemForm = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(itemForm, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    const clickedEle =
      e.target.classList.contains("fa-xmark") ||
      e.target.classList.contains("delete");

    if (clickedEle) {
      const item = e.target.closest(".card");
      const itemID = item.getAttribute("data-id");

      item.remove();

      if (type === "meal") {
        this._tracker.removeMeal(itemID);
      } else {
        this._tracker.removeWorkout(itemID);
      }
    }
  }

  _filterItems(type, e) {
    const filterInput = document.getElementById(`filter-${type}s`);
    const mealWorkoutList = document.getElementById(`${type}-items`);
    const listItems = mealWorkoutList.querySelectorAll("div.card");

    listItems.forEach((item) => {
      const itemName = item.querySelector("h4").innerText;
      if (
        itemName.toLowerCase().indexOf(filterInput.value.toLowerCase()) === -1
      ) {
        item.style.display = "none";
      } else {
        item.style.display = "flex";
      }
    });
  }
}

const fireApp = new AppInit();
