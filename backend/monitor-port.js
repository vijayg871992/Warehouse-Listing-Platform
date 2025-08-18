const { exec } = require('child_process');

// Function to check if port is in use
const checkPort = (port) => {
    return new Promise((resolve) => {
        exec(`lsof -ti :${port}`, (error, stdout) => {
            resolve(stdout ? true : false);
        });
    });
};

// Function to kill processes on port
const killPort = (port) => {
    return new Promise((resolve) => {
        exec(`lsof -ti :${port}`, (error, stdout) => {
            if (stdout) {
                const pids = stdout.trim().split('\n');
                exec(`kill -9 ${pids.join(' ')}`, () => {
                    console.log(`✅ Killed processes on port ${port}: ${pids.join(', ')}`);
                    // Wait longer to ensure cleanup
                    setTimeout(resolve, 3000);
                });
            } else {
                resolve();
            }
        });
    });
};

// Monitor port 8080 and clean up if needed
const monitorPort = async () => {
    const port = 8080;
    const isInUse = await checkPort(port);
    
    if (isInUse) {
        console.log(`⚠️  Port ${port} is in use. Cleaning up...`);
        await killPort(port);
        // Wait a bit for cleanup
        setTimeout(() => {
            console.log(`✅ Port ${port} is now available`);
        }, 2000);
    } else {
        console.log(`✅ Port ${port} is available`);
    }
};

// Run if called directly
if (require.main === module) {
    monitorPort();
}

module.exports = { checkPort, killPort, monitorPort };