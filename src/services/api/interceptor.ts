import { InternalAxiosRequestConfig } from 'axios';

import { coreApi } from './core-api';

let interceptorId: number | null = null;

const configureAxiosInterceptors = (token: string | null) => {
  if (interceptorId !== null) {
    coreApi.interceptors.request.eject(interceptorId);
  }

  interceptorId = coreApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    },
    (error: unknown) => {
      return Promise.reject(error);
    }
  );
};

export default configureAxiosInterceptors;
