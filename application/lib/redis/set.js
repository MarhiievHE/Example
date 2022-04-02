(server, port, dbName, key, value, ttl = null) =>
  new Promise((resolve, reject) => {
    if (ttl)
      db.redis[server][port][dbName].set(key, value,
        'EX', ttl, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
    else
      db.redis[server][port][dbName].set(key, value, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
  });
