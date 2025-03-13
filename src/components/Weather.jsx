import React, {useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png' 
import wind_icon from '../assets/wind.png' 
import humidity_icon from '../assets/humidity.png'

const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false);
    const [hourlyForecast, setHourlyForecast] = useState([]);

    const allIcons = {
        "01d": "https://openweathermap.org/img/wn/01d@2x.png",
        "01n": "https://openweathermap.org/img/wn/01n@2x.png",
        "02d": "https://openweathermap.org/img/wn/02d@2x.png",
        "02n": "https://openweathermap.org/img/wn/02n@2x.png",
        "03d": "https://openweathermap.org/img/wn/03d@2x.png",
        "03n": "https://openweathermap.org/img/wn/03n@2x.png",
        "04d": "https://openweathermap.org/img/wn/04d@2x.png",
        "04n": "https://openweathermap.org/img/wn/04n@2x.png",
        "09d": "https://openweathermap.org/img/wn/09d@2x.png",
        "09n": "https://openweathermap.org/img/wn/09n@2x.png",
        "10d": "https://openweathermap.org/img/wn/10d@2x.png",
        "10n": "https://openweathermap.org/img/wn/10n@2x.png",
        "13d": "https://openweathermap.org/img/wn/13d@2x.png",
        "13n": "https://openweathermap.org/img/wn/13n@2x.png",
    };
    const parseCoordinates = (input) => {
        const degreeRegex = /(\d+\.\d+)°?\s*([NS]),?\s*(\d+\.\d+)°?\s*([EW])/i;
        const match = input.match(degreeRegex);
    
        if (match) {
            let lat = parseFloat(match[1]);
            let lon = parseFloat(match[3]);
    
            // Adjust based on N/S and E/W
            if (match[2].toUpperCase() === 'S') lat = -lat;
            if (match[4].toUpperCase() === 'W') lon = -lon;
    
            return `${lat},${lon}`;
        }
    
        return null;
    };

    const identifyInputType = (input) => {
        const latLonRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
        const zipCodeRegex = /^\d{5}$/;
    
        if (latLonRegex.test(input)) {
            return 'coordinates';
        } else if (zipCodeRegex.test(input)) {
            return 'zipcode';
        } else if (parseCoordinates(input)) {
            return 'degreeCoordinates';
        } else {
            return 'city';
        }
    };
    const search = async(input)=>{
        let url;
        let forecastUrl;
        const inputType = identifyInputType(input.trim());

        if (inputType === 'coordinates') {
            const [lat, lon] = input.split(',').map(coord => coord.trim());
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_APP_ID}`;
        } else if (inputType === 'degreeCoordinates') {
            const parsedCoords = parseCoordinates(input);
            const [lat, lon] = parsedCoords.split(',');
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_APP_ID}`;
        } else if (inputType === 'zipcode') {
            url = `https://api.openweathermap.org/data/2.5/weather?zip=${input.trim()}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${input.trim()}&appid=${import.meta.env.VITE_APP_ID}`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${input.trim()}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${input.trim()}&appid=${import.meta.env.VITE_APP_ID}`;
        }

        try{
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) {
                if (data.cod === "404") {
                    alert(`location"${input}" not found. Please try again.`);
                } else {
                    alert(`Error: ${data.message}`);
                }
                setWeatherData(false);
                return;
            }
            const formattedDate = new Date(data.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',   
                day: 'numeric'   
            });
            const localTime = new Date((data.dt + data.timezone) * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC'
            });
            console.log(data);

            // Fetch hourly forecast data
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            console.log(forecastData);
            if (forecastData && forecastData.list) {
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    date: formattedDate,
                    feelsLike: Math.floor(data.main.feels_like),
                    localTime: localTime, 
                    icon: allIcons[data.weather[0].icon] || allIcons["01d"]
                });
    
                // Extract hourly forecast data (forecast is available every 3 hours)
                const hourly = forecastData.list.slice(0, 5);
                setHourlyForecast(hourly);
            } else {
                console.error('Forecast data is unavailable or invalid:', forecastData);
                alert('Failed to fetch hourly forecast. Please try again later.');
            }

            }catch(error){
                alert('Failed to fetch weather data. Please try again later.');
                console.error('Error fetching weather data:', error);
            }
        }
        
        const handleSearch = () => {
            const input = inputRef.current.value.trim();
            if (input) {
                search(input);
            } else {
            alert('Please enter a location.');
            }
        }
  return (
    <div className='weather'>
        <div className='search-bar'>
            <input ref= {inputRef} type='text' placeholder='Search'/>
            <img src={search_icon} alt=''onClick={()=>handleSearch(inputRef.current.value)}/>
        </div>
        <div className='date-time-container'>
            <p className='date'>{weatherData.date}</p>
             <p className='local-time'>{weatherData.localTime}</p>
        </div>
        
        {weatherData && <img src={weatherData.icon} alt="Weather Icon" className='weather-icon' />}
        <p className='temperature'>{weatherData.temperature}°C</p>
        <p1 className='feels-like'>Feels like: {weatherData.feelsLike}°C</p1>
        <p className='location'>{weatherData.location}</p>
        <div className="weather-data">
            <div className='col'>
                <img src={humidity_icon} alt=""/>
                <div>
                    <p>{weatherData.humidity}%</p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className='col'>
                <img src={wind_icon} alt="" />
                <div>
                    <p>{weatherData.windSpeed} Km/h</p>
                    <span>Wind Speed</span>
                </div>
            </div>
        </div>

        {hourlyForecast.length > 0 && (
                <div className="hourly-forecast">
                    {hourlyForecast.map((forecast, index) => (
                        <div key={index} className="hourly-forecast-item">
                            <img src={allIcons[forecast.weather[0].icon]} alt="forecast icon" />
                            <p>{new Date(forecast.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                            <p>{Math.floor(forecast.main.temp - 273.15)}°C</p>
                        </div>
                    ))}
                </div>
            )}
    </div>
  )
}

export default Weather