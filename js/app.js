class CalorieTracker {
  constructor(calLimit) {
    this._calorieLimit = calLimit;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCalorieLimit(calLimit);
  }

  // Public methods

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
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

  resetDay() {
    document.querySelectorAll("div.reset").forEach((card) => {
      card.innerText = 0;
    });

    // Remaining: Reset the Progress bar

    this._meals.splice(0, this._meals.length);
    this._workouts.splice(0, this._workouts.length);
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

  _displayRemainingCalories() {
    document.getElementById("calories-remaining").innerText =
      this._calorieLimit - this._totalCalories;
  }

  _displayCalorieProgress() {
    const progressBar = document.getElementById("calorie-progress");
    const caloriesRemainingCard = document.querySelector("div.alert-bg");

    const caloriesRemaining = this._calorieLimit - this._totalCalories;
    const progressPercent = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(progressPercent, 100);

    progressBar.style.width = `${width}%`;

    if (caloriesRemaining <= 0) {
      caloriesRemainingCard.classList.add("bg-danger");
      progressBar.classList.remove("bg-success");
      progressBar.classList.add("bg-danger");
    }
  }

  _renderState() {
    this._displayNetCalories();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayRemainingCalories();
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

const paratha = new Meal("Paratha", 555);
const rice = new Meal("Rice", 250);
const dhokla = new Meal("Dhokla", 400);

const pushUps = new Workout("Push ups", 120);
const plank = new Workout("Plank", 100);

const tracker = new CalorieTracker(1000);

tracker.addMeal(paratha);
tracker.addMeal(rice);
// tracker.addMeal(dhokla);
tracker.addWorkout(pushUps);
// tracker.addWorkout(plank);
// tracker.removeMeal(paratha.id);
