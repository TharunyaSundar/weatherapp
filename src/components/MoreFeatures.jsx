import React, { useState } from "react";
import './MoreFeatures.css';

function MoreFeatures() {
    const [city, setCity] = useState('');
    const [dateRange, setDateRange] = useState('1');
    const [forecastData, setForecastData] = useState([]);
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [locationName, setLocationName] = useState('');
    const [uid, setUid] = useState(null);

    const fetchWeatherData = async () => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=${dateRange * 8}&appid=${import.meta.env.VITE_APP_ID}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === '200') {
                setLocationName(data.city.name); 
                const groupedData = data.list.reduce((acc, item) => {
                    const date = new Date(item.dt * 1000).toLocaleDateString();
                    if (!acc[date]) acc[date] = [];
                    acc[date].push({
                        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        temp: Math.floor(item.main.temp),
                    });
                    return acc;
                }, {});
                setForecastData(Object.entries(groupedData));
                setCurrentPage(1);
            } else {
                alert('Location not found');
            }
        } catch (error) {
            alert('Error fetching weather data');
        }
    };

    const addToHistory = () => {
        if (!forecastData.length) return;
        const currentDayForecast = forecastData[currentPage - 1]; 
        if (!currentDayForecast) return;

        const historyEntry = {
            city,
            dateRange,
            forecastData: currentDayForecast[1],
        };
        setHistory([...history, historyEntry]);
    };

    const deleteHistory = (index) => {
        setHistory(history.filter((_, i) => i !== index));
    };

    const totalPages = forecastData.length;
    const currentDayForecast = forecastData[currentPage - 1] || [];

    return (
        <div className='more-features'>
            <h2>Weather Forecast</h2>
            <div className='input-group'>
                <input
                    type='text'
                    placeholder='Enter city name'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <select onChange={(e) => setDateRange(e.target.value)} value={dateRange}>
                    <option value='1'>1 Day</option>
                    <option value='2'>2 Days</option>
                    <option value='3'>3 Days</option>
                    <option value='5'>5 Days</option>
                </select>
                <button onClick={fetchWeatherData}>Get Forecast</button>
            </div>

            {forecastData.length > 0 && (
                <div>
                    <h3>Day {currentPage} - {currentDayForecast[0]}</h3>
                    <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>
                        🌍 {locationName}
                    </p>
                    <table className="forecast-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Temperature (°C)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDayForecast[1]?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.time}</td>
                                    <td>{item.temp}°C</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Day {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>

                    <button onClick={addToHistory} style={{ marginTop: '10px' }}>
                        Add to History
                    </button>
                </div>
            )}

            <div className='history'>
                <h3>Search History</h3>
                {history.length > 0 ? (
                    history.map((entry, index) => (
                        <div key={index} className="history-entry">
                            <div>
                                <strong>{entry.city}</strong> ({entry.dateRange} day{entry.dateRange > 1 ? 's' : ''}) -
                                {entry.forecastData.map((item, idx) => (
                                    <span key={idx}> 
                                    {item.time}: <strong>{item.temp}°C</strong>
                                    {idx !== entry.forecastData.length - 1 ? ' | ' : ''}
                                    </span>
                                ))}
                            </div>
                            <button onClick={() => deleteHistory(index)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No history available</p>
                )}
            </div>
        </div>
    );
}

export default MoreFeatures;
