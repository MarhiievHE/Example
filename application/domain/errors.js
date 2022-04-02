
({
  duplicate: {
    email: new Error('duplicate email', 422),
    nickname: new Error('duplicate nickname', 422),
  },
  blacklisted: {
    email: new Error('blacklisted email', 422),
  },
  invalid: {
    email: new Error('invalid email', 400),
    code: new Error('invalid code', 400),
    login: new Error('invalid login or password', 400),
    promocode: new Error('invalid promocode', 400),
    password: new Error('invalid password', 400),
  },
  notfound: {
    email:  new Error('email not found', 404),
  },
  limit: {
    attempts: new Error('limit of attempts reached', 410),
    rate: new Error('request limit reached', 429),
  },
  priority: {
    pay: new Error('payment required', 402),
    login: new Error('login required', 401),
  },
  fiasco: {
    verify: new Error('fiasco', 418),
  }
});
