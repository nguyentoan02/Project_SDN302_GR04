const express = require("express");
const { connectToDatabase } = require("./config/database");
const configureExpress = require("./config/express");

const app = configureExpress();
const PORT = process.env.PORT || 3000;

connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
