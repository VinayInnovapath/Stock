const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT =5000;

app.use(cors());


app.get('/api/stocks', async (req, res) => {
  const symbol = 'IBM';  
  const apiKey = 'demo';  

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    );
    
    // Extract and format stock data
    const stockData = response.data['Time Series (Daily)'];
    const formattedData = Object.keys(stockData).map(date => ({
      date,
      price: stockData[date]['4. close'],  // Extract the close price for each day
    }));

    // Send the stock data as a JSON response
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config(); 

// const app = express();
// const PORT = process.env.PORT; 

// app.use(cors());

// app.get('/api/stocks', async (req, res) => {
//   const symbol = 'IBM';  
//   const apiUrl = process.env.ALPHA_VANTAGE_API_URL; 

//   try {
//     const response = await axios.get(
//       `${apiUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
//     );
    
//     // Extract and format stock data
//     const stockData = response.data['Time Series (Daily)'];
//     const formattedData = Object.keys(stockData).map(date => ({
//       date,
//       price: stockData[date]['4. close'],  // Extract the close price for each day
//     }));

//     // Send the stock data as a JSON response
//     res.json(formattedData);
//   } catch (error) {
//     console.error('Error fetching stock data:', error);
//     res.status(500).json({ error: 'Failed to fetch stock data' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
