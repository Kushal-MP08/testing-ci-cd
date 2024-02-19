const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/user");
app.use(express.json());
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`MongoDB connected and App is Listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  
  res.send("Server is up and running for the qatesting ci/cds");
});


app.use("/user", userRoute);