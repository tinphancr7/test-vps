const convertVnToUsd = (price: number, type?: string) => {
  let calculator = 0;
  if (type === "VNG" || type === "VietServer") {
    calculator = price / 26000;
  } else if (type === "BuCloud") {
    calculator = price / 25500;
  } else {
    calculator = price / 26000;
  }

  return parseFloat(calculator.toFixed(2));
};

const convertVnToUsdFollowProviderId = (price: number, providerId?: string) => {
  let calculator = 0;
  if (
    providerId === "66dea61b22306cb524671c45" ||
    providerId === "6711d27e4fa47d51268d04e6"
  ) {
    calculator = price / 26000;
  } else if (providerId === "6728373045a431ee0fed355b") {
    calculator = price / 25500;
  } else {
    calculator = price / 26000;
  }

  return parseFloat(calculator.toFixed(2));
};

export { convertVnToUsd, convertVnToUsdFollowProviderId };
