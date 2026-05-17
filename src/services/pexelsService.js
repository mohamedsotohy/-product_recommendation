import axios from "axios";

const API_KEY = import.meta.env.VITE_IMAGE_API_KEY;

export const getImageFromPexels = async (query) => {
  try {
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
      {
        headers: {
          Authorization: API_KEY,
        },
      },
    );
    return response.data.photos[0]?.src.medium || null;
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return null;
  }
};
