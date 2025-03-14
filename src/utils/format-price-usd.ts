const formatPriceUsd = (value: number) => {
    const parsePrice = parseFloat(String(value));

    return parsePrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

export { formatPriceUsd }