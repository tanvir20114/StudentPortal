import { useMemo, use } from 'react'
import axios from 'axios'
import { AuthContext } from '../AuthContext'

export default function useAxiosSecure() {
  const { user, signOutUser } = use(AuthContext);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL
    });

    instance.interceptors.request.use(async (config) => {
      if (user) {
        const token = await user.getIdToken();
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          signOutUser().catch((err) => alert(err));
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [user, signOutUser]);

  return axiosInstance;
}
