import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

interface ResponseData {
  data: any;
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
});

instance.interceptors.response.use(
  (response): AxiosResponse<ResponseData> => {
    return response.data
  },
  function (error: AxiosError) {
    console.error('Response Interceptor - Error:', error);
    return Promise.reject(error);
  },
)

export default instance;
