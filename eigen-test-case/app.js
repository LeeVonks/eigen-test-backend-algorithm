const express = require("express");
const { specs, swaggerUi } = require("./swagger");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const pool = require("./config/db");

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/books", bookRoutes);
app.use("/members", memberRoutes);

const PORT = process.env.PORT || 3000;

pool
  .getConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Eigen is running on => http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = app;
