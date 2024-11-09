import axios from "axios";

// Helper function to get token from localStorage and prepare headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Helper function for API requests
export const fetchData = async (url, headers) => {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Helper function for DELETE request
export const deleteData = async (url, headers) => {
  try {
    const response = await axios.delete(url, { headers });
    return response;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};