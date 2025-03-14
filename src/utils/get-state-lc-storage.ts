function getStateLocalStorage(key: string) {
	let result;

	if (typeof window !== "undefined") {
		result = window.localStorage.getItem(key);
	}

	return result ? JSON.parse(result) : null;
}

export {getStateLocalStorage};
