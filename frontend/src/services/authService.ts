import api from "./api";

// Login function
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    const { token, user } = response.data;

    // Store token in localStorage
    localStorage.setItem("token", token);

    return { success: true, user };
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    return { success: false, message };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return { success: true, user: response.data.user };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to get user info";
    return { success: false, message };
  }
};

// Get user files
export const getUserFiles = async () => {
  try {
    const response = await api.get("/files");
    return { success: true, files: response.data.files };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to get files";
    return { success: false, message };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
