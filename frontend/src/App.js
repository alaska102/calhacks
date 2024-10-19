import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Practice from './pages/practice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Default route */}
        <Route path="/home" element={<Home />} />  {/* Explicit /home route */}
        <Route path = "/practice" element ={<Practice />} /> 
      </Routes>
    </Router>
  );
}

export default App;

