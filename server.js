const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Models
const User = require("./models/User");
const Company = require("./models/ompany");
const Expense = require("./models/EExpense"); // Make sure file is "Expense.js" with uppercase "E"

// Connect MongoDB
mongoose
  .connect("mongodb://localhost:27017/expenseapp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo connection error:", err));

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, "odoo"))); // Or 'public' if you use public folder

// Signup endpoint (MongoDB only)
app.post("/api/signup", async (req, res) => {
  const { email, password, company, country, role, manager } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ message: "Missing fields" });
  try {
    const user = new User({ email, password, company, country, role, manager });
    await user.save();
    res.json({ message: "Signup successful!" });
  } catch (err) {
    res.status(400).json({ message: "User already exists or error!" });
  }
});

// Login endpoint (MongoDB only)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: "Invalid credentials." });
  res.json({ message: "Login successful!", role: user.role });
});

// Submit expense (MongoDB)
app.post("/api/employee/submit-expense", async (req, res) => {
  const { user, amount, currency, category, description, date } = req.body;
  if (!user || !amount)
    return res.status(400).json({ message: "Missing fields" });
  const expense = new Expense({
    user,
    amount,
    currency,
    category,
    description,
    date,
    status: "Pending",
  });
  await expense.save();
  res.json({ message: "Expense submitted!" });
});

// Get expenses (MongoDB)
app.get("/api/employee/expenses", async (req, res) => {
  const { user } = req.query;
  try {
    const list = await Expense.find({ user });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// Manager: pending expenses (MongoDB)
app.get("/api/manager/pending-expenses", async (req, res) => {
  try {
    const list = await Expense.find({ status: "Pending" });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
