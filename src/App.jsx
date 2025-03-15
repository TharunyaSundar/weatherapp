import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Weather from './components/Weather';
import MoreFeatures from './components/MoreFeatures';

const App = () => {
  return (
    <div className='app'>
    <Router>
        <Routes>
          <Route path="/" element={<Weather />} />
          <Route path="/more-features/*" element={<MoreFeatures />} />
        </Routes>
    </Router>
  </div>
  );
};

export default App;
