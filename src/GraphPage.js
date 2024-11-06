import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS } from 'chart.js/auto'; 
import { useNavigate, useLocation } from 'react-router-dom'; 



const GraphPage = () => {
  const [stocks, setStocks] = useState([]); 
  const [filteredStocks, setFilteredStocks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useLocation(); 
  const { startDate, endDate } = state || {}; 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchStocks = async () => {
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


  if (loading) return <div>Loading stock data...</div>;
  if (error) return <div>{error}</div>;

  const dates = filteredStocks.map(stock => stock.date);
  const prices = filteredStocks.map(stock => parseFloat(stock.price));

  const priceRanges = ['< $50', '$50 - $100', '$100 - $150', '>$150', '$200 - $230', '$230 - $260'];

  const priceCounts = {
    '< $50': 0,
    '$50 - $100': 0,
    '$100 - $150': 0,
    '>$150': 0,
    '$200 - $230': 0,
    '$230 - $260': 0,
  };

  filteredStocks.forEach(stock => {
    const price = parseFloat(stock.price);
    if (price < 50) priceCounts['< $50']++;
    else if (price >= 50 && price < 100) priceCounts['$50 - $100']++;
    else if (price >= 100 && price < 150) priceCounts['$100 - $150']++;
    else if (price >= 150 && price < 200) priceCounts['>$150']++;
    else if (price >= 200 && price <= 230) priceCounts['$200 - $230']++;
    else if (price > 230 && price <= 260) priceCounts['$230 - $260']++;
  });

  const pieData = {
    labels: priceRanges,
    datasets: [
      {
        data: Object.values(priceCounts),
        backgroundColor: [
          '#FF6384',  
          '#36A2EB',  
          '#FFCE56',   
          '#4BC0C0',   
          '#FF0000',   
          '#87CEEB',   
        ],
        hoverBackgroundColor: [
          '#FF3D6D', 
          '#1D88C2', 
          '#FFBC00', 
          '#3AC2C1',
          '#FF2A2A', 
          '#00BFFF', 
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc, value) => acc + value, 0);
            const value = dataset.data[tooltipItem.index];
            const percentage = ((value / total) * 100).toFixed(2);
            return tooltipItem.label + ': ' + percentage + '%';
          },
        },
      },
    },
  };

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Stock Prices',
        data: prices,
        borderColor: 'light blue',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  };

  const handleHideGraph = () => {
    navigate('/'); 
  };

  return (
    <div className="graph-container">
      <button className="hide-graph-button" onClick={handleHideGraph}>
        Go Back
      </button>

      <h1>Stock Price Graph</h1>

      <div className="charts-container">
        <div className="chart-item">
          <h2>Line Chart</h2>
          <Line data={chartData} options={chartOptions} height={300} />
        </div>

        <div className="chart-item">
          <h2>Pie Chart</h2>
          <Pie data={pieData} options={pieOptions} height={300} />
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
