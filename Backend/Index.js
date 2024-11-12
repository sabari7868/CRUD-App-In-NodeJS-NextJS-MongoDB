require("./DB/Connect"); // Initialize the database connection
const Express = require("express");
const jwt = require("jsonwebtoken");
const Model = require("./DB/User");
const Product = require("./DB/Products");
const Cors = require("cors");

const App = Express();
const PORT = 8000;
const jwtKey = "IAMZUBI";

App.use(Express.json());
App.use(Cors());

// JWT verification middleware
const verify = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).json({ error: "Invalid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Authorization token required" });
  }
};

// Register endpoint
App.post("/register", async (req, res) => {
  try {
    const data = new Model(req.body);
    const result = await data.save();
    const token = jwt.sign({ result }, jwtKey);
    res.json({ result, token });
  } catch (err) {
    res.status(500).json({ error: "Failed to register" });
  }
});

// Login endpoint
App.post("/login", async (req, res) => {
  try {
    const data = await Model.findOne(req.body).select("-Password");
    if (data) {
      const token = jwt.sign({ data }, jwtKey);
      res.json({ result: data, token });
    } else {
      res.status(404).json({ error: "No account available" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Add product (protected)
App.post("/add-product", verify, async (req, res) => {
  try {
    const data = new Product(req.body);
    const result = await data.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Get all products (protected)
App.get("/", verify, async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

// Delete a product (protected)
App.delete("/delete/:_id", verify, async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params._id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Update a product (protected)
App.put("/update/:_id", verify, async (req, res) => {
  try {
    const result = await Product.updateOne({ _id: req.params._id }, { $set: req.body });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Get a single product by ID (protected)
App.get("/single/:_id", verify, async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params._id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});

// Start the server
App.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

