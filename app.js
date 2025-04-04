const express = require('express');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/api',transactionRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
