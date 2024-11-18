const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./backend/routes/userRouter");
const errorHandler = require("./backend/middlewares/errorHandlerMiddleware");
require("dotenv").config(); //middleware
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL);
app.use("/", userRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server started at ${PORT}`));
