#!/usr/bin/env node

const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');

// Function to kill existing processes on port 8080
const killExistingProcesses = () => {
    return new Promise((resolve) => {
        // Kill processes using port 8080
        exec('lsof -ti :8080', (error, stdout) => {
            if (stdout) {
                const pids = stdout.trim().split('\n');
                const killPromises = pids.map(pid => {
                    return new Promise((resolveKill) => {
                        exec(`kill -9 ${pid}`, () => resolveKill());
                    });
                });
                Promise.all(killPromises).then(() => {
                    console.log('✅ Cleared existing processes on port 8080');
                    setTimeout(resolve, 1000); // Wait 1 second
                });
            } else {
                resolve();
            }
        });
    });
};

// Function to start the server
const startServer = async () => {
    console.log('🔄 Starting Warehouse Listing Platform backend...');
    
    // Kill existing processes first
    await killExistingProcesses();
    
    // Start nodemon
    const serverProcess = spawn('npx', ['nodemon', 'server.js'], {
        cwd: path.dirname(__dirname),
        stdio: 'inherit',
        env: { ...process.env }
    });

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping server...');
        serverProcess.kill('SIGTERM');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Stopping server...');
        serverProcess.kill('SIGTERM');
        process.exit(0);
    });

    serverProcess.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    });

    serverProcess.on('exit', (code) => {
        if (code !== 0) {
            console.log(`⚠️  Server process exited with code ${code}`);
        }
    });
};

// Start the server
startServer();