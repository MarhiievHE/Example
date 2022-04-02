(async (accountId, instrumentId) => {
  if (accountId === 2 && instrumentId === 1) {
    // console.log({ accountId, instrumentId });
    return true;
  }
  return false;
});
