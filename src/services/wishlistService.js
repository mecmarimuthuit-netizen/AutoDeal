import API from "./api";

export const getWishlist = async () => {
  const response = await API.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (carId) => {
  const response = await API.post("/wishlist", {
    car_id: carId,
  });

  return response.data;
};

export const removeFromWishlist = async (carId) => {
  const response = await API.delete(`/wishlist/${carId}`);
  return response.data;
};
