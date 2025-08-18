const bcrypt = require('bcryptjs');
const { User } = require('../models');
const sequelize = require('../config/database');

const resetAdminPassword = async () => {
  try {
    // Ensure database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Find the admin user
    const adminUser = await User.findOne({ 
      where: { email: 'vijayshankar871992@gmail.com' } 
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found with email: vijayshankar871992@gmail.com');
      process.exit(1);
    }

    // Set new password (you can change this)
    const newPassword = 'admin123';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the admin user's password
    await adminUser.update({
      password: hashedPassword
    });

    console.log('✅ Admin password reset successfully!');
    console.log('=================================');
    console.log('Admin Login Credentials:');
    console.log('Email: vijayshankar871992@gmail.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('=================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
    process.exit(1);
  }
};

// Run the script
resetAdminPassword();