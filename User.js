const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  company: String,
  country: String,
  role: String,
  manager: String,
});
module.exports = mongoose.model("User", userSchema);
