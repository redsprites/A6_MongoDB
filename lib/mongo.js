const mongoose = require('mongoose');
const uri = "mongodb+srv://test:test@cluster0.ef4gjym.mongodb.net/sponsormatch?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to database");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = { connect };