export const LocalStorageEventTarget = new EventTarget();
export const setAccessTokenToLS = (accessToken: any) => {
  localStorage.setItem("accessToken", accessToken);
};

export const clearLS = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export const getAccessTokenFromLS = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") !== "undefined"
      ? localStorage.getItem("accessToken")
      : "";
  }

  return "";
};
export const setUserToLS = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};
