const { User, Warehouse, WarehouseApproval } = require('../models');
const sequelize = require('../config/database');

const addComprehensiveWarehouseData = async () => {
  try {
    // Ensure database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models
    await sequelize.sync();

    // Find the admin user
    let adminUser = await User.findOne({ where: { email: 'vijayshankar871992@gmail.com' } });
    
    if (!adminUser) {
      console.error('❌ Admin user not found');
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${adminUser.firstName} ${adminUser.lastName}`);

    // Sample warehouse data with diverse categories for proper filter testing
    const warehousesData = [
      {
        name: 'Mumbai Premium Cold Storage',
        mobile_number: '9876543210',
        email: 'contact@mumbaistorage.com',
        ownership_type: 'Owner',
        address: '123 Industrial Area, Andheri East',
        city: 'Mumbai',
        state: 'Maharashtra',
        pin_code: 400069,
        warehouse_type: 'Climate Controlled Storage',
        build_up_area: 12000,
        total_plot_area: 18000,
        total_parking_area: 3000,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        plinth_height: 8.5,
        dock_doors: 6,
        electricity_kva: 500,
        additional_details: 'Temperature controlled environment, 24/7 security, CCTV surveillance, fire safety systems',
        rent: 85000,
        deposit: 170000,
        description: 'State-of-the-art cold storage facility perfect for pharmaceutical and food industries',
        approval_status: 'approved',
        views: 45,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600',
          'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&h=600'
        ])
      },
      {
        name: 'Delhi Logistics Hub',
        mobile_number: '9876543211',
        email: 'info@delhilogistics.com',
        ownership_type: 'Broker',
        address: '456 Transport Nagar, Gurgaon',
        city: 'Gurgaon',
        state: 'Haryana',
        pin_code: 122001,
        warehouse_type: 'Standard or General Storage',
        build_up_area: 8500,
        total_plot_area: 12000,
        total_parking_area: 2500,
        plot_status: 'Commercial',
        listing_for: 'Sale',
        plinth_height: 6.0,
        dock_doors: 4,
        electricity_kva: 200,
        additional_details: 'Easy highway access, modern loading bays, office space included',
        rent: null,
        deposit: null,
        description: 'Strategic location warehouse with excellent connectivity to NCR region',
        approval_status: 'approved',
        views: 62,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600',
          'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600'
        ])
      },
      {
        name: 'Bangalore Tech Storage',
        mobile_number: '9876543212',
        email: 'storage@bangaloretech.com',
        ownership_type: 'Owner',
        address: '789 Electronics City Phase 2',
        city: 'Bangalore',
        state: 'Karnataka',
        pin_code: 560100,
        warehouse_type: 'Hazardous Chemicals Storage',
        build_up_area: 15000,
        total_plot_area: 20000,
        total_parking_area: 4000,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        plinth_height: 10.0,
        dock_doors: 8,
        electricity_kva: 750,
        additional_details: 'Customs bonded facility, high-tech security, automated systems',
        rent: 120000,
        deposit: 360000,
        description: 'High-security bonded warehouse for electronics and tech equipment',
        approval_status: 'approved',
        views: 78,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600',
          'https://images.unsplash.com/photo-1565373679814-43ad4821b7c6?w=800&h=600',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600'
        ])
      },
      {
        name: 'Chennai Port Logistics',
        mobile_number: '9876543213',
        email: 'operations@chennaiport.com',
        ownership_type: 'Owner',
        address: '321 Port Area, Ennore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pin_code: 600057,
        warehouse_type: 'Standard or General Storage',
        build_up_area: 22000,
        total_plot_area: 35000,
        total_parking_area: 8000,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        plinth_height: 12.0,
        dock_doors: 12,
        electricity_kva: 1000,
        additional_details: 'Port proximity, container handling facilities, rail connectivity',
        rent: 180000,
        deposit: 540000,
        description: 'Massive distribution center near Chennai port for import/export operations',
        approval_status: 'approved',
        views: 134,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600'
        ])
      },
      {
        name: 'Pune Automotive Storage',
        mobile_number: '9876543214',
        email: 'contact@puneautostorage.com',
        ownership_type: 'Broker',
        address: '654 Chakan Industrial Area',
        city: 'Pune',
        state: 'Maharashtra',
        pin_code: 410501,
        warehouse_type: 'Hazardous Chemicals Storage',
        build_up_area: 9500,
        total_plot_area: 14000,
        total_parking_area: 3500,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        plinth_height: 7.5,
        dock_doors: 5,
        electricity_kva: 300,
        additional_details: 'Automotive parts storage, climate controlled sections, heavy duty flooring',
        rent: 75000,
        deposit: 225000,
        description: 'Specialized facility for automotive components and parts storage',
        approval_status: 'approved',
        views: 56,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600'
        ])
      },
      {
        name: 'Hyderabad Pharma Vault',
        mobile_number: '9876543215',
        email: 'info@hyderabadpharma.com',
        ownership_type: 'Owner',
        address: '987 Genome Valley, Shameerpet',
        city: 'Hyderabad',
        state: 'Telangana',
        pin_code: 500078,
        warehouse_type: 'Climate Controlled Storage',
        build_up_area: 6500,
        total_plot_area: 9000,
        total_parking_area: 1800,
        plot_status: 'Industrial',
        listing_for: 'Sale',
        plinth_height: 5.5,
        dock_doors: 3,
        electricity_kva: 400,
        additional_details: 'WHO-GMP compliant, temperature mapping, backup power systems',
        rent: null,
        deposit: null,
        description: 'Pharmaceutical-grade cold storage facility with regulatory compliance',
        approval_status: 'approved',
        views: 89,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600',
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600'
        ])
      },
      {
        name: 'Kolkata Jute Storage Complex',
        mobile_number: '9876543216',
        email: 'storage@kolkatajute.com',
        ownership_type: 'Owner',
        address: '147 Belghoria Industrial Area',
        city: 'Kolkata',
        state: 'West Bengal',
        pin_code: 700056,
        warehouse_type: 'Standard or General Storage',
        build_up_area: 18000,
        total_plot_area: 25000,
        total_parking_area: 5000,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        plinth_height: 8.0,
        dock_doors: 7,
        electricity_kva: 350,
        additional_details: 'Traditional storage facility, high ceiling, natural ventilation',
        rent: 65000,
        deposit: 130000,
        description: 'Large capacity warehouse suitable for textile and jute industries',
        approval_status: 'approved',
        views: 43,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600',
          'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&h=600'
        ])
      },
      {
        name: 'Ahmedabad Chemicals Hub',
        mobile_number: '9876543217',
        email: 'operations@ahmedabadchem.com',
        ownership_type: 'Broker',
        address: '258 GIDC Vatva',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pin_code: 382445,
        warehouse_type: 'Hazardous Chemicals Storage',
        build_up_area: 11000,
        total_plot_area: 16000,
        total_parking_area: 3200,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        plinth_height: 9.0,
        dock_doors: 4,
        electricity_kva: 450,
        additional_details: 'Chemical storage compliant, safety systems, ventilation controls',
        rent: 95000,
        deposit: 285000,
        description: 'Specialized warehouse for chemical and pharmaceutical storage',
        approval_status: 'approved',
        views: 67,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1565103173241-5df5c6b60c7b?w=800&h=600',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600'
        ])
      },
      {
        name: 'Noida Express Logistics',
        mobile_number: '9876543218',
        email: 'express@noidaexpress.com',
        ownership_type: 'Owner',
        address: '369 Sector 63, Electronic City',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pin_code: 201301,
        warehouse_type: 'Standard or General Storage',
        build_up_area: 14500,
        total_plot_area: 20000,
        total_parking_area: 4500,
        plot_status: 'Commercial',
        listing_for: 'Rent',
        plinth_height: 10.5,
        dock_doors: 9,
        electricity_kva: 600,
        additional_details: 'Express delivery hub, automated sorting, round-the-clock operations',
        rent: 135000,
        deposit: 405000,
        description: 'Modern distribution center optimized for e-commerce and express delivery',
        approval_status: 'approved',
        views: 92,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600',
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600'
        ])
      },
      {
        name: 'Jaipur Textiles Warehouse',
        mobile_number: '9876543219',
        email: 'textiles@jaipurwarehouse.com',
        ownership_type: 'Owner',
        address: '741 Sitapura Industrial Area',
        city: 'Jaipur',
        state: 'Rajasthan',
        pin_code: 302022,
        warehouse_type: 'Standard or General Storage',
        build_up_area: 13500,
        total_plot_area: 18000,
        total_parking_area: 3600,
        plot_status: 'Industrial',
        listing_for: 'Sale',
        plinth_height: 7.0,
        dock_doors: 6,
        electricity_kva: 250,
        additional_details: 'Textile storage facility, humidity control, pest control systems',
        rent: null,
        deposit: null,
        description: 'Large warehouse designed for textile and garment industry storage',
        approval_status: 'approved',
        views: 51,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600',
          'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600'
        ])
      },
      {
        name: 'Kochi Marine Storage',
        mobile_number: '9876543220',
        email: 'marine@kochistorage.com',
        ownership_type: 'Broker',
        address: '852 Cochin Port Area, Willingdon Island',
        city: 'Kochi',
        state: 'Kerala',
        pin_code: 682009,
        warehouse_type: 'Hazardous Chemicals Storage',
        build_up_area: 16000,
        total_plot_area: 22000,
        total_parking_area: 4400,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        plinth_height: 11.0,
        dock_doors: 8,
        electricity_kva: 550,
        additional_details: 'Port facility, customs clearance, container handling, marine insurance',
        rent: 110000,
        deposit: 330000,
        description: 'Strategic port-based warehouse for international shipping and logistics',
        approval_status: 'approved',
        views: 73,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600',
          'https://images.unsplash.com/photo-1565103173241-5df5c6b60c7b?w=800&h=600',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600'
        ])
      },
      {
        name: 'Indore FMCG Distribution',
        mobile_number: '9876543221',
        email: 'fmcg@indoredistribution.com',
        ownership_type: 'Owner',
        address: '963 Pithampur Industrial Area',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pin_code: 454775,
        warehouse_type: 'Standard or General Storage',
        build_up_area: 10500,
        total_plot_area: 15000,
        total_parking_area: 3000,
        plot_status: 'Industrial',
        listing_for: 'Rent',
        plinth_height: 8.5,
        dock_doors: 5,
        electricity_kva: 300,
        additional_details: 'FMCG optimized layout, quick turnover design, inventory management systems',
        rent: 78000,
        deposit: 156000,
        description: 'Distribution center designed specifically for FMCG products and retail supply',
        approval_status: 'approved',
        views: 38,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600'
        ])
      }
    ];

    let createdCount = 0;

    for (const warehouseData of warehousesData) {
      try {
        // Check if warehouse already exists
        const existingWarehouse = await Warehouse.findOne({ 
          where: { name: warehouseData.name } 
        });
        
        if (!existingWarehouse) {
          // Add owner_id and timestamps
          const completeWarehouseData = {
            ...warehouseData,
            owner_id: adminUser.id,
            created_at: new Date(),
            updated_at: new Date()
          };

          const warehouse = await Warehouse.create(completeWarehouseData);
          console.log(`✅ Created warehouse: ${warehouse.name}`);
          
          // Create approval record
          await WarehouseApproval.create({
            warehouse_id: warehouse.id,
            status: 'approved',
            created_at: new Date(),
            updated_at: new Date()
          });
          
          createdCount++;
        } else {
          console.log(`⚠️  Warehouse already exists: ${warehouseData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating warehouse ${warehouseData.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully created ${createdCount} warehouses!`);
    console.log(`📊 Warehouse categories created:`);
    console.log(`   - Climate Controlled Storage: 2 warehouses`);
    console.log(`   - Standard/General Storage: 6 warehouses`);
    console.log(`   - Hazardous Chemicals Storage: 4 warehouses`);
    console.log(`\n🏙️  Cities covered:`);
    console.log(`   Mumbai, Delhi/Gurgaon, Bangalore, Chennai, Pune, Hyderabad,`);
    console.log(`   Kolkata, Ahmedabad, Noida, Jaipur, Kochi, Indore`);
    console.log(`\n💰 Pricing options:`);
    console.log(`   - For Rent: 9 properties`);
    console.log(`   - For Sale: 3 properties`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding comprehensive warehouse data:', error);
    process.exit(1);
  }
};

// Run the script
addComprehensiveWarehouseData();