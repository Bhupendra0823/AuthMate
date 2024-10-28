require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const session = require("express-session");

const registerLoginRoute = require("./routes/registerLoginRoute");

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie:{secure:false}
    })
)

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use(
    cors({
      origin: '*', // Allow requests from any origin; you can specify the frontend URL here if it's known
      methods: ['GET', 'POST'],
      credentials: true,
    })
  );

app.use('/auth.mate',registerLoginRoute)



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to db");
    app.listen(process.env.PORT, () => {
      // console.log("Server is listening on port 7860");
    }); 
  })
  .catch((err) => {
    console.log(err);
  }); 
