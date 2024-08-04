const express = require('express');
const app = express();

const reverseRoutes = require('./routes/reverseRoutes');
const longestWordRoutes = require('./routes/longestWordRoutes');
const queryCountRoutes = require('./routes/queryCountRoutes');
const matrixDiagonalRoutes = require('./routes/matrixDiagonalRoutes');

app.use(express.json());

app.use('/api', reverseRoutes);
app.use('/api', longestWordRoutes);
app.use('/api', queryCountRoutes);
app.use('/api', matrixDiagonalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});
