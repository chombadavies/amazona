import express from "express";
import data from "./data";
import dotenv from "dotenv";
import config from "./config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute"
import bodyParser from "body-parser";

dotenv.config();

const mongodbUrl = config.MONGODB_URL;
mongoose.connect(
  mongodbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  function (err, res) {
    if (err) {
      console.log("DB connection failed" + err);
    } else {
      console.log("DB connection successful" + mongodbUrl);
    }
  }
);

const app = express();
app.use(bodyParser.json());
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);



// app.get("/api/products/:id", (req, res) => {
//   const productId = req.params.id;
//   const product = data.products.find((x) => x._id === productId);
//   if (product) res.send(product);
//   else res.status(404).send({ message: "product not found" });
// });
// app.get("/api/products", (req, res) => {
//   res.send(data.products);
// });

app.listen(5000, () => {
  console.log("server started at http://localhost:5000");
});


