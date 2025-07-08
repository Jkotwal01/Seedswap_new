const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const testRoutes = require("./routes/testRoutes");
// for API documentation...
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("swagger.yaml");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/seeds", require("./routes/seedRoutes"));
app.use("/api/swaps", require("./routes/swapRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/marketplace", require("./routes/marketplaceRoutes"));
app.use("/api", require("./routes/messageRoutes")); // This is route for messaging between the swapes
// for API Doucumentaion
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// for tesing only 
app.use("/api/test", testRoutes);



module.exports = app;
