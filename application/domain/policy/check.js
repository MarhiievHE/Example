(async (accountId, policy, argv) => {
  const accessLevels = ['guest', 'free', 'priority'];
  const minLevel = accessLevels.indexOf(policy.minLevel);

  let isPriority = false;
  const isGuest = accountId === -1;
  if (!isGuest) {
    if (Object.prototype.hasOwnProperty.call(policy, 'instrumentId')) {
      const instrumentId = policy.instrumentId;
      isPriority = await domain.permission
        .checkInstrument(accountId, instrumentId);
    }
  }

  const runningLevel = isGuest ? 0 :
    isPriority ? 2 : 1;

  switch (minLevel) {
  case 0:
    break;
  case 1:
    if (isGuest) return {
      access: false,
      error: domain.errors.priority.login,
    };
    break;
  case 2:
    if (isGuest || !isPriority) return {
      access: false,
      error: domain.errors.priority.pay,
    };
    break;
  default:
    return {
      access: false,
      error: domain.errors.fiasco.verify,
    };
  }

  const runLevelCheck = [
    () => {
      if (Object.prototype.hasOwnProperty.call(policy, 'guest')) {
        const guest = policy.guest;
        if (!guest.accessible) {
          return {
            access: false,
            error: domain.errors.fiasco.verify,
          };
        }
        if (Object.prototype.hasOwnProperty.call(guest, 'parameters')) {
          for (const [key, value] of Object.entries(guest.parameters)) {
            if (!value.includes(argv[key])) {
              return {
                access: false,
                error: domain.errors.priority.login,
              };
            }
          }
        }
        return {
          access: true,
          error: null,
        };
      } else
        throw new Error('Empty access description object for guest level');
    },
    () => {
      if (Object.prototype.hasOwnProperty.call(policy, 'free')) {
        const free = policy.free;
        if (!free.accessible) {
          return {
            access: false,
            error: domain.errors.fiasco.verify,
          };
        }
        if (Object.prototype.hasOwnProperty.call(free, 'parameters')) {
          for (const [key, value] of Object.entries(free.parameters)) {
            if (!value.includes(argv[key])) {
              return {
                access: false,
                error: domain.errors.priority.pay,
              };
            }
          }
        }
        return {
          access: true,
          error: null,
        };
      } else
        throw new Error('Empty access description object for free level');
    },
    () => {
      if (Object.prototype.hasOwnProperty.call(policy, 'priority')) {
        const priority = policy.priority;
        if (!priority.accessible) {
          return {
            access: false,
            error: domain.errors.fiasco.verify,
          };
        }
        if (Object.prototype.hasOwnProperty.call(priority, 'parameters')) {
          for (const [key, value] of Object.entries(priority.parameters)) {
            if (!value.includes(argv[key])) {
              return {
                access: false,
                error: domain.errors.fiasco.verify,
              };
            }
          }
        }
        return {
          access: true,
          error: null,
        };
      } else
        throw new Error('Empty access description object for priority level');
    },
  ];

  return runLevelCheck[runningLevel]();
});
