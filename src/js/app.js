import CalorieTracker from "./CalorieTracker.js";
import Storage from "./Storage.js";
import { Meal, Workout } from "./MealWorkout.js";

import { Modal, Collapse } from "bootstrap";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

class App {
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
    Storage.setCalorieLimit(this._tracker._calorieLimit);

    const limitModalEle = document.getElementById("limit-modal");
    Modal.getInstance(limitModalEle).hide();

    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();

    document.body.classList.remove("modal-open");
    document.documentElement.style.overflow = "auto";

    this._tracker._renderState();
    this._reset();

    calorieLimitInput.value = "";
  }

  _reset(e) {
    this._tracker._totalCalories = 0;
    Storage.updateTotalCalories(this._tracker._totalCalories);

    this._tracker._meals = [];
    Storage.saveMeals(this._tracker._meals);

    this._tracker._workouts = [];
    Storage.saveWorkouts(this._tracker._workouts);

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
    const bsCollapse = new Collapse(itemForm, {
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

const fireApp = new App();
