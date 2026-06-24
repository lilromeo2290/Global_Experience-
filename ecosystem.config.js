module.exports = {
  apps: [
    {
      name: 'global-experience',
      script: '.next/standalone/server.js',
      cwd: '/home/globalexp/public_html',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: '/home/globalexp/logs/error.log',
      out_file: '/home/globalexp/logs/output.log',
      log_file: '/home/globalexp/logs/combined.log',
      time: true,
    },
  ],
};
