module.exports = {
  apps: [
    {
      name: 'global-experience',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: `${__dirname}/logs/error.log`,
      out_file: `${__dirname}/logs/output.log`,
      log_file: `${__dirname}/logs/combined.log`,
      time: true,
    },
  ],
};
