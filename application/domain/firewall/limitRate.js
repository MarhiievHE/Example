(async (context) => {
  const {
    // client,
    accountId,
    token,
  } = context;
  const banDurationList = [1, 3, 15, 60, 6 * 60, 24 * 60];
  const maxRequestPerMinute = 1000;
  const timeFormat = 'YYYY-MM-DD HH:mm';
  const expireTime = 10 * 60 * 60;
  const now = npm.moment().utc().format(timeFormat);
  if (!accountId | !token)
    return;
  const isGuest = accountId === -1;
  const apiPort = domain.utils.getApiPort();
  let calls = 1;
  const saveObj = {};
  const key = isGuest ? token : `limit_rate_${accountId}`;
  const tmpObj = await lib.redis.hgetall('main', apiPort, 'auth', key);
  if (!tmpObj) {
    return {
      access: false,
      error: domain.errors.limit.rate,
    };
  }
  if (Object.prototype.hasOwnProperty.call(tmpObj, 'calls')) {
    const callsObj = JSON.parse(tmpObj.calls);
    const banUntil = tmpObj.banUntil;
    if (banUntil !== 'null' && banUntil >= now) {
      return {
        access: false,
        error: domain.errors.limit.rate,
      };
    }
    if (Object.prototype.hasOwnProperty.call(callsObj, now)) {
      calls += callsObj[now];
      if (calls > maxRequestPerMinute) {
        let banDuration =  banDurationList[0];
        let newBanUntil = npm.moment(now)
          .add(banDuration, 'minutes').format(timeFormat);
        const minuteAgo = npm.moment(now)
          .subtract(1, 'minutes').format(timeFormat);
        const lastBanDuration = Number(tmpObj.lastBanDuration);
        if (banUntil !== 'null') {
          const index = banDurationList.indexOf(lastBanDuration);
          if (banUntil === minuteAgo) {
            banDuration = banDurationList[index === 5 ? 5 : index + 1];
            newBanUntil = npm.moment(now)
              .add(banDuration, 'minutes').format(timeFormat);
          }
        }
        saveObj['banUntil'] = newBanUntil;
        saveObj['lastBanDuration'] = banDuration;
        saveObj['calls'] = JSON.stringify({
          [now]: calls,
        });
        await lib.redis.hset('main', apiPort, 'auth', key, saveObj);
        lib.redis.expire('main', apiPort, 'auth', key, expireTime);
        return {
          access: false,
          error: domain.errors.limit.rate,
        };
      }
    }
    saveObj['calls'] = JSON.stringify({
      [now]: calls,
    });
    lib.redis.hset('main', apiPort, 'auth', key, saveObj);
    lib.redis.expire('main', apiPort, 'auth', key, expireTime);
    return {
      access: true,
      error: null,
    };
  }
  saveObj['calls'] = JSON.stringify({
    [now]: calls,
  });
  saveObj['banUntil'] = 'null';
  saveObj['lastBanDuration'] = 'null';
  lib.redis.hset('main', apiPort, 'auth', key, saveObj);
  lib.redis.expire('main', apiPort, 'auth', key, expireTime);
  return {
    access: true,
    error: null,
  };
});
