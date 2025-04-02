export const getUserFromStorage = () => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (storedUser && token) {
    return JSON.parse(storedUser);
  }
  return null;
};

export const saveUserToStorage = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
