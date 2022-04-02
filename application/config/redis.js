({
  main: {
    params: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      password: '123456789',
    },
    ports: {
      6379: {
        auth: 0,
        permission: 1,
      },
    },
  }
});
