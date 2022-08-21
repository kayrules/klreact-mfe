import axios from 'axios';
import { retrieveData } from './persistState';
import { URL as LOGIN_INIT_URL } from '../redux/slices/login/init';
import { URL as LOGIN_URL } from '../redux/slices/login/login';

// TODO: do we need memoization and caching?
// TODO: handle refreshToken

// env file
// const baseUrl = 'http://localhost:3001';
const baseUrl = process.env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  method: 'POST',
  headers: {}
});

const getCommonHeaders = (url) => {
  const exclusions = [
    LOGIN_INIT_URL,
    LOGIN_URL,
    // '/authService/100000002/claims',
    // '/authService/100000002/session/user_attributes?provider=DcpHsm'
  ];

  if (!exclusions.includes(url.replace(baseUrl, ''))) {
    return {
      sourceChannel: 'DIB',
      'X-Kony-Authorization': retrieveData('x-token'),
      'Client-Device-ID': retrieveData('DeviceId'),
    }
  }

  return {};
}

/* Intercept requests to add common headers. */
axiosInstance.interceptors.request.use(
  config => {
    if (config?.method === 'post') {
      return {
        ...config,
        headers: {
          ...config.headers,
          ...getCommonHeaders(config.url),
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
