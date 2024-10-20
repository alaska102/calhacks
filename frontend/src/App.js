import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Practice from './pages/practice';
import Category from './pages/category';
import Response from './pages/response'; // Import the new Response component
import FollowUp from './pages/follow_up';
import FinalReply from './pages/final_reply';
import Insights from './pages/insights';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Default route */}
        <Route path="/home" element={<Home />} />  {/* Explicit /home route */}
        <Route path="/practice" element={<Practice />} /> 
        <Route path="/category" element={<Category />} /> 
        <Route path="/response" element={<Response />} /> {/* Add route for the Response page */}
        <Route path="/follow-up" element={<FollowUp />} /> {/* Add route for the Response page */}
        <Route path="/final_reply" element={<FinalReply />} /> {/* Add route for the Response page */}
        <Route path = "/insights" element ={<Insights />} />
      </Routes>
    </Router>
  );
}

export default App;
