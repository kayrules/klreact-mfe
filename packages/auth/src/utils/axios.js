import axios from 'axios';

// env file
// const baseUrl = 'http://localhost:3001';
const baseUrl = process.env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  method: 'POST',
  headers: {}
});

/* Intercept requests to add common headers. */
axiosInstance.interceptors.request.use(
  config => {
    if (config?.method === 'post') {
      return {
        ...config,
        headers: {
          ...config.headers,
        }
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
