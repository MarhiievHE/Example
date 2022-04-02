(server, port, dbName, key = '', values = {}) =>
  new Promise((resolve, reject) => {
    const toSave = [];
    for (const [key, value] of Object.entries(values)) {
      toSave.push(
        key || 'undefined',
        value === false ? false : value || 'undefined'
      );
    }
    db.redis[server][port][dbName].hset(key, toSave, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
