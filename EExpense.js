const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({
  user: String,
  amount: Number,
  currency: String,
  category: String,
  description: String,
  date: String,
  status: String,
  receiptUrl: String,
  comments: [String],
  approver: String,
});
module.exports = mongoose.model("Expense", expenseSchema);
