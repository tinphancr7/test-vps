const formatPrice = (value: number) => {
	const currency = new Intl.NumberFormat("en-US", {
		currency: "USD",
		minimumFractionDigits: 0,
	});

	return currency.format(value);
};

export {formatPrice};
