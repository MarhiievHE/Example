(server, port, dbName, key, value) =>
  new Promise((resolve, reject) => {
    db.redis[server][port][dbName].expire(key, value, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
