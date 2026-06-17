const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust this path if your model is somewhere else
require('dotenv').config(); // Loads your .env variables

async function createAdmin() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('[OK] Connected to Database');

    // Check if this admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shophive.com' });
    if (existingAdmin) {
      console.log('[WARN] Admin user already exists!');
      process.exit(0);
    }

    // Create the admin user
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@shophive.com',
      password: 'adminpassword123', // It will automatically hash thanks to your pre-save hook!
      role: 'admin'                 // Forcing the role to be admin
    });

    console.log('[OK] Success! Admin account created.');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: adminpassword123`);
    
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();