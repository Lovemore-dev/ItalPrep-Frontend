import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("italprep_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
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
  login(credentials) {
    return apiClient.post("/auth/login", credentials);
  },
  register(account) {
    return apiClient.post("/auth/register", account);
  },
  createAdmin(account) {
    return apiClient.post("/auth/admins", account);
  },
  createModule(module) {
    return apiClient.post("/content", module);
  },
  updateModule(slug, module) {
    return apiClient.put(`/content/${slug}`, module);
  },
  deleteModule(slug) {
    return apiClient.delete(`/content/${slug}`);
  },
  getTestimonials() {
    return apiClient.get("/testimonials");
  },
  submitTestimonial(quote) {
    return apiClient.post("/testimonials", { quote });
  },
  getPendingTestimonials() {
    return apiClient.get("/testimonials/pending");
  },
  approveTestimonial(id) {
    return apiClient.patch(`/testimonials/${id}/approve`);
  },
};
