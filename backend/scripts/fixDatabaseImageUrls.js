const { Warehouse } = require('../models');
const { Sequelize } = require('sequelize');

const fixDatabaseImageUrls = async () => {
    try {
        console.log('Starting database image URL fix...');
        
        // Find all warehouses with malformed URLs
        const warehouses = await Warehouse.findAll({
            where: {
                images: {
                    [Sequelize.Op.like]: '%http://vijayg.dev/uploads/%'
                }
            }
        });
        
        console.log(`Found ${warehouses.length} warehouses with malformed URLs`);
        
        for (const warehouse of warehouses) {
            let updatedImages = [];
            
            if (warehouse.images && Array.isArray(warehouse.images)) {
                updatedImages = warehouse.images.map(imageUrl => {
                    // Fix malformed URLs
                    if (imageUrl.includes('http://vijayg.dev/uploads/')) {
                        return imageUrl.replace('http://vijayg.dev/uploads/', 'https://vijayg.dev/warehouse-listing/uploads/');
                    }
                    // Handle other potential formats
                    if (imageUrl.startsWith('uploads/')) {
                        return `https://vijayg.dev/warehouse-listing/${imageUrl}`;
                    }
                    // Return unchanged if already correct
                    return imageUrl;
                });
                
                // Update the warehouse
                await warehouse.update({ images: updatedImages });
                console.log(`Fixed URLs for warehouse: ${warehouse.name} (ID: ${warehouse.id})`);
                console.log(`  Old: ${JSON.stringify(warehouse.images)}`);
                console.log(`  New: ${JSON.stringify(updatedImages)}`);
            }
        }
        
        console.log('Database image URL fix completed successfully!');
        
    } catch (error) {
        console.error('Error fixing database image URLs:', error);
    }
};

// Run the script if called directly
if (require.main === module) {
    fixDatabaseImageUrls()
        .then(() => {
            console.log('Script finished');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}

module.exports = { fixDatabaseImageUrls };