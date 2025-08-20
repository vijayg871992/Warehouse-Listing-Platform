const { Warehouse } = require('../models');
const sequelize = require('../config/database');

const fixWarehouseImages = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Get all warehouses
    const warehouses = await Warehouse.findAll();
    console.log(`📊 Found ${warehouses.length} warehouses to process`);

    // High-quality warehouse images from Unsplash (all HTTPS)
    const warehouseImagePools = [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1565373679814-43ad4821b7c6?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1565103173241-5df5c6b60c7b?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1565050997149-f8403bf5d2cd?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558125835-ac17b4e5f9f6?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1575726894767-5b0db4e6e7f8?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558125835-ac17b4e5f9f6?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1504306343620-069d4e3ab2c5?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1559536049-c64e90ad1071?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1527863480229-2c44b8e2c65a?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1561049933-c8010528954e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1565363593798-76dd15bb14f2?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1585648719436-3d6be4a9b69b?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&auto=format'
    ];

    // Local fallback images (using existing uploads)
    const localFallbacks = [
      'https://vijayg.dev/warehouse-listing/uploads/warehouse-1754020650733-825616370.png',
      'https://vijayg.dev/warehouse-listing/uploads/warehouse-1754020650737-845245493.png',
      'https://vijayg.dev/warehouse-listing/uploads/warehouse-1754020650739-363030355.png',
      'https://vijayg.dev/warehouse-listing/uploads/warehouse-1754020650740-575718295.JPG',
      'https://vijayg.dev/warehouse-listing/uploads/warehouse-1754020650743-673094200.JPG'
    ];

    let updatedCount = 0;

    for (const warehouse of warehouses) {
      try {
        let currentImages = [];
        
        // Parse existing images if they exist
        if (warehouse.images) {
          try {
            currentImages = JSON.parse(warehouse.images);
          } catch (e) {
            console.log(`⚠️  Could not parse images for ${warehouse.name}, will replace`);
            currentImages = [];
          }
        }

        // If no images or images are invalid, assign new ones
        if (!currentImages || currentImages.length === 0 || 
            currentImages.some(img => !img || !img.startsWith('https://'))) {
          
          // Generate unique set of images for this warehouse
          const warehouseIndex = updatedCount % warehouseImagePools.length;
          const selectedImages = [];
          
          // Primary images from Unsplash
          selectedImages.push(warehouseImagePools[warehouseIndex]);
          selectedImages.push(warehouseImagePools[(warehouseIndex + 1) % warehouseImagePools.length]);
          
          // Add local fallback as third image
          const localIndex = updatedCount % localFallbacks.length;
          selectedImages.push(localFallbacks[localIndex]);

          // Update the warehouse
          await warehouse.update({
            images: JSON.stringify(selectedImages)
          });

          console.log(`✅ Updated images for: ${warehouse.name}`);
          console.log(`   📸 Images: ${selectedImages.length} HTTPS URLs`);
          updatedCount++;
        } else {
          console.log(`ℹ️  ${warehouse.name} already has valid images`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${warehouse.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} warehouses with HTTPS images!`);
    console.log(`📊 Image Strategy Applied:`);
    console.log(`   - Primary: High-quality Unsplash images (HTTPS)`);
    console.log(`   - Fallback: Local uploaded images (HTTPS)`);
    console.log(`   - Format: 800x600 optimized for web`);
    console.log(`   - Total unique images available: ${warehouseImagePools.length + localFallbacks.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing warehouse images:', error);
    process.exit(1);
  }
};

// Run the script
fixWarehouseImages();