import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import './Table.css';

const Table = () => {
  const [stocks, setStocks] = useState([]);  
  const [filteredStocks, setFilteredStocks] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');  
  const [endDate, setEndDate] = useState(''); 
  const [isDashboard, setIsDashboard] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();  

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/stocks');
        setStocks(response.data); 
        setFilteredStocks(response.data);  
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error('Error fetching stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);  

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = stocks.filter(stock => {
        const stockDate = new Date(stock.date);
        return stockDate >= new Date(startDate) && stockDate <= new Date(endDate);
      });
      setFilteredStocks(filtered); 
    } else {
      setFilteredStocks(stocks); 
    }
  }, [startDate, endDate, stocks]); 

  const handleDashboardClick = useCallback(() => {
    setIsDashboard(true);  
  }, []);

  const handleWelcomeClick = useCallback(() => {
    setIsDashboard(false);  
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev); 
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (!e.target.closest('.sidebar') && !e.target.closest('.hamburger-menu')) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleClickOutside);
      }
    };
  }, [handleClickOutside]); 

  const memoizedFilteredStocks = useMemo(() => filteredStocks, [filteredStocks]);

  return (
    <div className="app-container">
      <div className="hamburger-menu" onClick={toggleSidebar}>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Sidebar</h2>
        <ul>
          <li onClick={handleDashboardClick}>Dashboard</li>
          <li onClick={handleWelcomeClick}>Welcome</li>
        </ul>
      </div>

      <div className="main-content">

      <div className="date-filters">
          <label>
            Start Date:
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </label>
          <label>
            End Date:
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </label>
        </div>

        {loading && <div>Loading stock data...</div>}
        {error && <div>{error}</div>}

        {isDashboard ? (
          <div className="table-container">

          <button 
              className="graph-button" 
              onClick={() => navigate('/graph', { state: { startDate, endDate } })}
            >
              View Graph
            </button>

            <table className="stock-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {memoizedFilteredStocks.map((stock, index) => (
                  <tr key={index}>
                    <td>{stock.date}</td>
                    <td>{stock.price}</td>
                    <td>{stock.expiration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="welcome-message">
            <h2>Welcome to the Stock Dashboard</h2>
            <p>Please select an option from the sidebar to view data or the dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
