const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const User = require('../models/User');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedforward';
    console.log(`Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('\n--- Provision FeedForward Administrator Account ---');
    const name = (await question('Full Name [FeedForward Admin]: ')) || 'FeedForward Admin';
    const email = (await question('Email Address [admin@feedforward.org]: ')) || 'admin@feedforward.org';
    const password = (await question('Password [Admin@12345]: ')) || 'Admin@12345';
    const phone = (await question('Phone [+1 (555) 000-0000]: ')) || '+1 (555) 000-0000';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log(`User ${email} already exists. Upgrading to admin role...`);
      existingUser.role = 'admin';
      existingUser.isActive = true;
      await existingUser.save();
      console.log(`✅ User ${email} is now an active Admin.`);
    } else {
      await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone,
        role: 'admin',
        address: 'FeedForward Administration Office',
        city: 'San Francisco',
        isActive: true,
      });
      console.log(`✅ Administrator account created successfully for: ${email}`);
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    rl.close();
    process.exit(1);
  }
};

createAdmin();
