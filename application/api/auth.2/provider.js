({
  authExpire: 60 * 60 * 10,

  generateToken() {
    const { characters, secret, length } = config.sessions;
    return metarhia.metautil.generateToken(secret, characters, length);
  },

  saveSession(token, data) {
    const apiPort = domain.utils.getApiPort();
    const expireTime = api.auth.provider.authExpire;
    lib.redis.hset('main', apiPort, 'auth', token, { ...data })
      .then(() => lib.redis.expire('main', apiPort, 'auth', token, expireTime))
      .catch(console.error);
  },

  startSession(token, data, fields = {}) {
    const apiPort = domain.utils.getApiPort();
    const expireTime = api.auth.provider.authExpire;
    const createTime = npm.moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const accountId = data.accountId;
    if (accountId > 0) {
      const key = `limit_rate_${accountId}`;
      lib.redis.hset('main', apiPort, 'auth', key, {
        createTime,
      })
        .then(() => lib.redis.expire('main', apiPort, 'auth', key, expireTime))
        .catch(console.error);
    }
    lib.redis.hset('main', apiPort, 'auth', token, {
      ...data,
      ...fields,
      createTime,
    })
      .then(() => lib.redis.expire('main', apiPort, 'auth', token, expireTime))
      .catch(console.error);
  },

  async restoreSession(token) {
    const apiPort = domain.utils.getApiPort();
    const expireTime = api.auth.provider.authExpire;
    const data = await lib.redis.hgetall('main', apiPort, 'auth', token);
    const restoreTime = npm.moment().utc().format('YYYY-MM-DD HH:mm:ss');
    if (data) {
      const accountId = Number(data.accountId);
      if (accountId > 0) {
        const key = `limit_rate_${accountId}`;
        lib.redis.hset('main', apiPort, 'auth', key, {
          restoreTime,
        })
          .then(() =>
            lib.redis.expire('main', apiPort, 'auth', key, expireTime)
          )
          .catch(console.error);
      }
      lib.redis.hset('main', apiPort, 'auth', token, { restoreTime });
      lib.redis.expire('main', apiPort, 'auth', token, expireTime);
      return {
        ...data,
        accountId
      };
    }
    return null;
  },

  deleteSession(token) {
    const apiPort = domain.utils.getApiPort();
    lib.redis.dell('main', apiPort, 'auth', token);
  },

  async registerUser(login, password) {
    login = login.toLowerCase();
    return db.pg.insert('Account', { login, password });
  },

  async getUser(login) {
    return db.pg.row('Account', { login });
  },
});
