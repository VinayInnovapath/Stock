import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Table from './Table';          
import GraphPage from './GraphPage';  

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/graph" element={<GraphPage />} />
      </Routes>
    </Router>
  );
};

export default App;
