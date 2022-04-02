({
  parameters: {
    test: 'number'
  },
  access: 'token',
  policy: {
    name: 'TEST',
    instrumentId: 1,
    minLevel: 'free',
    guest: {
      accessible: false,
    },
    free: {
      parameters: {
        test: [0, 1]
      },
      accessible: true,
    },
    priority: {
      parameters: {
        test: [0, 1, 2]
      },
      accessible: true,
    }
  },
  async method({ test }) {
    {
      const policy = application.resources.application
        .api.collection.test['1'].test.exports.policy;
      const accountId = context.accountId || -1;
      const argv = {  test };
      const limits = await domain.firewall.limitRate(context);
      if (!limits.access)
        return limits.error;
      const validation = await domain.policy.check(accountId, policy, argv);
      if (!validation.access)
        return validation.error;
    }

    const func = [
      () => npm.moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      () => npm.moment().format('YYYY-MM-DD HH:mm:ss'),
      () => npm.moment().utc().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    ];
    if (func.length < test)
      return { result: domain.error.fiasco.verify };
    return { result: func[test]() };
  }
});
