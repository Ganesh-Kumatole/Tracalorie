class CalorieTracker {
  constructor() {
    this.storage = new Storage();

    this._calorieLimit = this.storage.getCalorieLimit();
    this._totalCalories = this.storage.getTotalCalories();
    this._meals = this.storage.getMeals();
    this._workouts = this.storage.getWorkouts();

    this._renderState();
  }

  // Public methods

  addMeal(meal) {
    this._meals.push(meal);
    this.storage.saveMeals(this._meals);

    this._totalCalories += meal.calories;
    this.storage.updateTotalCalories(this._totalCalories);

    this._displayNewMeal(meal);
    this._renderState();
  }

  removeMeal(id) {
    this._meals.forEach((meal, index) => {
      if (meal.id === id) {
        this._totalCalories -= meal.calories;
        this.storage.updateTotalCalories(this._totalCalories);

        this._meals.splice(index, 1);
        this.storage.saveMeals(this._meals);
      }
    });

    this._renderState();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this.storage.saveWorkouts(this._workouts);

    this._totalCalories -= workout.calories;
    this.storage.updateTotalCalories(this._totalCalories);

    this._displayNewWorkout(workout);
    this._renderState();
  }

  removeWorkout(id) {
    this._workouts.forEach((workout, index) => {
      if (workout.id === id) {
        this._totalCalories += workout.calories;
        this.storage.updateTotalCalories(this._totalCalories);

        this._workouts.splice(index, 1);
        this.storage.saveWorkouts(this._workouts);
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
    } else {
      caloriesRemainingCard.classList.remove("bg-danger");
      progressBar.classList.remove("bg-danger");
      progressBar.classList.add("bg-success");
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
          <h4 class="mx-1 name-size">${meal.name}</h4>
          <div class="fs-1 calories-capsule calories-capsule-mobile bg-primary text-white text-center rounded-2 px-2 px-sm-5">
            ${meal.calories} 
          </div>
          <button class="delete btn  btn-sm mx-2">
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
          <h4 class="mx-1 name-size">${workout.name}</h4>
          <div class="fs-1 calories-capsule calories-capsule-mobile bg-primary text-white text-center rounded-2 px-2 px-sm-5"> 
            ${workout.calories} 
          </div>
          <button class="delete btn  btn-sm mx-2">
            <i class="fa-solid fa-xmark "></i>
          </button>
        </div>
      </div>`;

    workoutItemsList.append(div);
  }

  _loadItems(meals, workouts) {
    meals.forEach((meal) => {
      this._displayNewMeal(meal);
    });
    workouts.forEach((workout) => {
      this._displayNewWorkout(workout);
    });
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
    this._tracker = new CalorieTracker();
    this._tracker._loadItems(this._tracker._meals, this._tracker._workouts);
    this._loadEventListeners();
  }

  _loadEventListeners() {
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
    this._tracker.storage.setCalorieLimit(this._tracker._calorieLimit);

    const limitModalEle = document.getElementById("limit-modal");
    bootstrap.Modal.getInstance(limitModalEle).hide();

    this._tracker._renderState();
    this._reset();

    calorieLimitInput.value = "";
  }

  _reset(e) {
    this._tracker._totalCalories = 0;
    this._tracker.storage.updateTotalCalories(this._tracker._totalCalories);

    this._tracker._meals = [];
    this._tracker.storage.saveMeals(this._tracker._meals);

    this._tracker._workouts = [];
    this._tracker.storage.saveWorkouts(this._tracker._workouts);

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

class Storage {
  setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  getCalorieLimit() {
    if (localStorage.getItem("calorieLimit") !== null) {
      return +localStorage.getItem("calorieLimit");
    } else {
      return 2000;
    }
  }

  updateTotalCalories(totalCalories) {
    localStorage.setItem("TotalCalories", totalCalories);
  }

  getTotalCalories() {
    if (localStorage.getItem("TotalCalories") !== null) {
      return +localStorage.getItem("TotalCalories");
    } else {
      return 0;
    }
  }

  saveMeals(meals) {
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  getMeals() {
    if (localStorage.getItem("meals") !== null) {
      return JSON.parse(localStorage.getItem("meals"));
    } else {
      return [];
    }
  }

  saveWorkouts(workouts) {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  getWorkouts() {
    if (localStorage.getItem("workouts") !== null) {
      return JSON.parse(localStorage.getItem("workouts"));
    } else {
      return [];
    }
  }
}

const fireApp = new AppInit();
