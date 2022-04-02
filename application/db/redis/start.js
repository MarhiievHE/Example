async () => {
  if (application.worker.id === 'W1') {
    console.debug('Connect to redis');
  }
  Object.keys(config.redis).map((serverName) => {
    db.redis[serverName] = {};
    const serverConf = config.redis[serverName];
    Object.keys(serverConf.ports).map((port) => {
      db.redis[serverName][port] = {};
      Object.keys(serverConf.ports[port]).map((dataBase) => {
        const dbConfig = {
          ...serverConf.params,
          port,
          // eslint-disable-next-line id-denylist
          db: serverConf.ports[port][dataBase],
        };
        if (application.worker.id === 'W1') {
          console.log({ dbConfig, dataBase });
        }
        db.redis[serverName][port][dataBase] = npm.redis.createClient(dbConfig);
        npm.redis.createClient(dbConfig).on('error', () => {
          if (application.worker.id === 'W1') {
            console.warn('No redis service detected, so quit client');
          }
          npm.redis.createClient(dbConfig).quit();
        });
        npm.redis.createClient(dbConfig).on('connect', () => {
          if (application.worker.id === 'W1') {
            console.warn('Redis comnected');
          }
        });
        // db.redis[serverName][port][dataBase].connect();
      });
    });
  });
};
