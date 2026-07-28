import API from "./api";

export const getMyCars = async () => {
  const response = await API.get("/cars/me");
  return response.data.data;
};

export const getCarById = async (id) => {
  const response = await API.get(`/cars/${id}`);
  return response.data.data;
};

export const createCar = async (formData) => {
  const response = await API.post("/cars", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const updateCar = async ({ id, formData }) => {
  const response = await API.put(`/cars/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const deleteCar = async (id) => {
  const response = await API.delete(`/cars/${id}`);
  return response.data;
};
