import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = [
  'Substance Abuse',
  'Domestic Violence',
  'Eating Disorder',
  'Sexual Harassment',
  'Suicide Prevention',
  'Sexual Abuse',
  'Gambling Addiction',
];

export default function Practice() {
  const navigate = useNavigate();

  const fetchScenario = async (category) => {
    try {
      const response = await axios.post('http://localhost:5001/api/generate_scenario', { genre: category });
      if (response.data && response.data.scenario) {
        return response.data.scenario;
      } else {
        console.error('No scenario data returned from the backend');
        return null;
      }
    } catch (error) {
      console.error('Error fetching scenario:', error);
      return null;
    }
  };

  const handleCategoryClick = async (category) => {
    const scenario = await fetchScenario(category);
    if (scenario) {
      navigate('/category', { state: { category, scenario } });
    }
  };

  return (
    <div>
      <h1>Select a category to practice:</h1>
      <ul>
        {categories.map((category, index) => (
          <li 
            key={index} 
            onClick={() => handleCategoryClick(category)} 
            style={{ cursor: 'pointer', margin: '10px 0', textDecoration: 'underline' }}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}
