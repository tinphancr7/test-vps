function setStateLocalStorage (key: string, value: any): void {
    if (typeof window !== "undefined") {
        const parseStringify = JSON.stringify(value);

		window.localStorage.setItem(key, parseStringify);
	}
}

export { setStateLocalStorage };