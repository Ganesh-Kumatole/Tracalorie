# Tracalorie App

A web application for tracking daily calorie intake and expenditure, built with vanilla JavaScript and Bootstrap using webpack for bundling.

## Overview

Tracalorie helps users monitor their daily calorie consumption and workout burn rates. It provides an intuitive interface to log meals, track workouts, and visualize progress towards daily calorie goals.

## Features

- **Daily Calorie Management**

  - Set custom daily calorie limits
  - Track calories consumed from meals
  - Monitor calories burned from workouts
  - View remaining calories and net gain/loss

- **Meal & Workout Tracking**

  - Add meals with calorie counts
  - Log workouts with calories burned
  - Filter meals and workouts using search
  - Delete individual items

- **Visual Progress Tracking**

  - Progress bar showing daily limit status
  - Stats dashboard with key metrics
  - Responsive design for all devices

- **Data Persistence**

  - Local storage integration
  - Reset daily tracking feature

## Technologies Used

- **Frontend**

  - HTML5
  - CSS3 & Bootstrap 5
  - Vanilla JavaScript (ES6+)
  - FontAwesome Icons

- **Build Tools**
  - Webpack
  - npm

## Project Structure

```
tracalorie-webpack/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── bootstrap.css
│   │   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── CalorieTracker.js
│   │   ├── Storage.js
│   │   └── MealWorkout.js
│   └── index.html
├── package.json
├── .gitignore
└── webpack.config.js
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tracalorie-webpack.git
```

2. Install dependencies:

```bash
cd tracalorie-webpack
npm install
```

3. Run development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Usage

1. Set your daily calorie limit using the "Set Daily Limit" button
2. Add meals and workouts using the respective forms
3. Use the filter inputs to search through meals and workouts
4. Track your progress through the stats dashboard
5. Reset the day when needed using the "Reset Day" button
