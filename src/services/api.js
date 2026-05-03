import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  // Get the list of all modules
  getModules() {
    return apiClient.get("/content");
  },

  // Get a specific module by slug
  getModuleDetails(slug) {
    return apiClient.get(`/content/${slug}`);
  },
};
