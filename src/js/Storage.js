class Storage {
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  static getCalorieLimit() {
    if (localStorage.getItem("calorieLimit") !== null) {
      return +localStorage.getItem("calorieLimit");
    } else {
      return 2000;
    }
  }

  static updateTotalCalories(totalCalories) {
    localStorage.setItem("TotalCalories", totalCalories);
  }

  static getTotalCalories() {
    if (localStorage.getItem("TotalCalories") !== null) {
      return +localStorage.getItem("TotalCalories");
    } else {
      return 0;
    }
  }

  static saveMeals(meals) {
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static getMeals() {
    if (localStorage.getItem("meals") !== null) {
      return JSON.parse(localStorage.getItem("meals"));
    } else {
      return [];
    }
  }

  static saveWorkouts(workouts) {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static getWorkouts() {
    if (localStorage.getItem("workouts") !== null) {
      return JSON.parse(localStorage.getItem("workouts"));
    } else {
      return [];
    }
  }
}

export default Storage;
