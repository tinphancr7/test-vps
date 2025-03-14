const API_URL: string = import.meta.env.VITE_API_URL as string;
console.log("API_URL", API_URL);
const API_VERSION: string = "api/v1";
const API_SERVICE: string = `${API_URL}/${API_VERSION}`;
const API_IMAGE: string = "";

export { API_SERVICE, API_IMAGE, API_URL };
