module.exports = {
  apps: [{
    name: 'warehouse-listing',
    cwd: '/var/www/vijayg.dev/projects/Warehouse-Listing-Platform/backend',
    script: './server.js',
    instances: 1,
    watch: false,
    autorestart: true,
    max_memory_restart: '400M',
    exp_backoff_restart_delay: 100,
    kill_timeout: 5000,
    env: {
      NODE_ENV: 'production',
      PORT: 8002,
      BASE_URL: 'https://vijayg.dev',
      CLIENT_URL: 'https://vijayg.dev/warehouse-listing',

      // Google OAuth Credentials (Warehouse Listing Specific)
      GOOGLE_CLIENT_ID: '73222571136-oo79gh8a2rd4gu6t19iarh9hg93cuqqe.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: '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',
      GOOGLE_CALLBACK_URL: 'https://vijayg.dev/warehouse-listing/auth/google/callback',

      // JWT Configuration
      JWT_SECRET: 'warehouse_listing_jwt_secret_2024',
      JWT_REFRESH_SECRET: 'warehouse_listing_refresh_secret_2024',

      // Database Configuration (Isolated)
      DB_HOST: '127.0.0.1',
      DB_PORT: '3306',
      DB_USER: 'wls_user',
      DB_PASSWORD: 'WarehouseListing_2025_SecurePwd!',
      DB_NAME: 'wh_listing_db',

      // Email Configuration
      EMAIL_USER: 'admin@vijayg.dev',
      EMAIL_PASS: 'VijjuProMax@871992',

      // CORS
      ALLOWED_ORIGINS: 'https://vijayg.dev'
    }
  }]
}