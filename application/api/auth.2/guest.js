({
  access: 'public',
  method: async () => {
    try {
      const token = api.auth.provider.generateToken();
      const data = { accountId: -1 };
      context.client.startSession(token, data);
      const { ip } = context.client;
      api.auth.provider.startSession(token, data, {
        ip,
      });
      return {
        result: {
          status: 'success',
          token
        }
      };
    } catch (err) {
      throw new Error(err);
    }
  },
});
