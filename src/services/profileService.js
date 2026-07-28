import API from "./api";

export const getProfile = async () => {
  const response = await API.get("/users/me");
  return response.data; 
};

export const updateProfile = async (formData) => {
  const response = await API.put("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; 
};