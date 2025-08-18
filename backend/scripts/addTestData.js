const { User, Warehouse, WarehouseApproval } = require('../models');
const sequelize = require('../config/database');

const addTestData = async () => {
  try {
    // Ensure database connection
    await sequelize.authenticate();

    // Sync models
    await sequelize.sync();

    // Find or create a test user
    let testUser = await User.findOne({ where: { email: 'testuser@example.com' } });
    
    if (!testUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('testpass123', 12);
      
      testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: hashedPassword,
        phoneNumber: '9876543210',
        role: 'user',
        isVerified: true
      });
    }

    // Create test warehouses
    const testWarehouses = [
      {
        name: 'Modern Storage Facility',
        mobile_number: '9876543210',
        email: 'warehouse1@example.com',
        ownership_type: 'Owner',
        address: '123 Industrial Area, Sector 18',
        city: 'Gurgaon',
        state: 'Haryana',
        pin_code: 122001,
        warehouse_type: 'Standard or General Storage',
        build_up_area: 5000,
        total_plot_area: 8000,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        electricity_kva: 100,
        rent: 50000,
        deposit: 100000,
        description: 'Well-maintained storage facility with good connectivity',
        owner_id: testUser.id,
        approval_status: 'pending',
        views: 0
      },
      {
        name: 'Climate Controlled Storage',
        mobile_number: '9876543211',
        email: 'warehouse2@example.com',
        ownership_type: 'Broker',
        address: '456 Logistics Park, Phase 2',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pin_code: 201301,
        warehouse_type: 'Climate Controlled Storage',
        build_up_area: 8000,
        total_plot_area: 12000,
        plot_status: 'Commercial',
        listing_for: 'Rent',
        electricity_kva: 200,
        rent: 80000,
        deposit: 160000,
        description: 'Temperature and humidity controlled storage facility',
        owner_id: testUser.id,
        approval_status: 'pending',
        views: 0
      }
    ];

    for (const warehouseData of testWarehouses) {
      const existingWarehouse = await Warehouse.findOne({ 
        where: { name: warehouseData.name } 
      });
      
      if (!existingWarehouse) {
        const warehouse = await Warehouse.create(warehouseData);
        
        // Create approval record
        await WarehouseApproval.create({
          warehouse_id: warehouse.id,
          status: 'pending'
        });
        
      } else {
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test data:', error);
    process.exit(1);
  }
};

// Run the script
addTestData();