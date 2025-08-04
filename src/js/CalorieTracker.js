import Storage from "./Storage.js";

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._renderState();
  }

  // Public methods

  addMeal(meal) {
    this._meals.push(meal);
    Storage.saveMeals(this._meals);

    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);

    this._displayNewMeal(meal);
    this._renderState();
  }

  removeMeal(id) {
    this._meals.forEach((meal, index) => {
      if (meal.id === id) {
        this._totalCalories -= meal.calories;
        Storage.updateTotalCalories(this._totalCalories);

        this._meals.splice(index, 1);
        Storage.saveMeals(this._meals);
      }
    });

    this._renderState();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    Storage.saveWorkouts(this._workouts);

    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);

    this._displayNewWorkout(workout);
    this._renderState();
  }

  removeWorkout(id) {
    this._workouts.forEach((workout, index) => {
      if (workout.id === id) {
        this._totalCalories += workout.calories;
        Storage.updateTotalCalories(this._totalCalories);

        this._workouts.splice(index, 1);
        Storage.saveWorkouts(this._workouts);
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
          <button class="delete btn btn-sm mx-2">
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

export default CalorieTracker;
