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

export { Meal, Workout };
