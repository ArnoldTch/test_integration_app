const mongoose = require('mongoose');
const User = require('../../models/User');
const { validUser } = require('./testUser');

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
}

async function seedUser() {
  await User.deleteMany({ email: validUser.email });
  await new User(validUser).save();
}

async function cleanupDB() {
  await User.deleteMany({ email: validUser.email });
  await mongoose.connection.close();
}

module.exports = { connectDB, seedUser, cleanupDB };
