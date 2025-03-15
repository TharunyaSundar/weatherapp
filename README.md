# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Weather App
Overview
This Weather App fetches and displays weather information for a given city using the OpenWeatherMap API. The app supports features like:

Weather Forecast: Get a weather forecast based on the city entered by the user.
History of Searches: Allows users to view their past weather searches and remove them.
CRUD Operations: Users can add new weather entries to the history, update or delete them (although database functionality has not been implemented for CRUD operations as required in the full version).
API Integration: The app retrieves weather data from an external API and displays it to the user, providing detailed temperature information for different times of the day.

## Project Setup
This project was developed using React.js, and it allows users to search for weather forecasts for a specific city. The app uses the OpenWeatherMap API to get the data.

## Features Implemented
API Integration (Weather Data Fetching): I integrated the OpenWeatherMap API to fetch weather data based on user inputs (city name and date range).
User Interface (UI): The app provides a simple UI where users can input a city name, select a date range, and view weather data in a table format.
History Management: Users can view their past searches and delete records from their search history.

## To set up and run your project, follow these steps:

Clone the repository:

Run:
git clone [https://github.com/yourusername/weather-app.git](https://github.com/TharunyaSundar/weatherapp.git)
cd <repository-folder>

Install dependencies:

Install necessary dependencies, including react-router-dom:
npm install
npm install react-router-dom

npm start or npm run dev
