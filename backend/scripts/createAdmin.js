const bcrypt = require('bcryptjs');
const { User } = require('../models');
const sequelize = require('../config/database');

const createAdminUser = async () => {
  try {
    // Ensure database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models
    await sequelize.sync();
    console.log('Database models synchronized.');

    // Check if admin already exists
    let existingAdmin = await User.findOne({ where: { email: 'admin@warehouse.com' } });
    
    if (existingAdmin) {
      console.log('Old admin user found. Updating to new email...');
      // Update existing admin to new email
      await existingAdmin.update({
        email: 'vijayshankar871992@gmail.com'
      });
      console.log('✅ Admin user updated successfully!');
      console.log('=================================');
      console.log('Admin Login Credentials:');
      console.log('Email: vijayshankar871992@gmail.com');
      console.log('Password: admin123');
      console.log('Role: admin');
      console.log('=================================');
      process.exit(0);
    }

    // Check if new admin email already exists
    existingAdmin = await User.findOne({ where: { email: 'vijayshankar871992@gmail.com' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists with new email!');
      console.log('Email: vijayshankar871992@gmail.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'vijayshankar871992@gmail.com',
      password: hashedPassword,
      phoneNumber: '9999999999',
      role: 'admin',
      isVerified: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('=================================');
    console.log('Admin Login Credentials:');
    console.log('Email: admin@warehouse.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('=================================');
    console.log('You can now login to the admin dashboard');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();