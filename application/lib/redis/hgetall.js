(server, port, dbName, key) =>
  new Promise((resolve, reject) => {
    db.redis[server][port][dbName].hgetall(key, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
