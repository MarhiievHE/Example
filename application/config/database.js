({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'application',
  user: process.env.DB_USER || 'marcus',
  password: process.env.DB_PASSWORD || 'marcus',
});
