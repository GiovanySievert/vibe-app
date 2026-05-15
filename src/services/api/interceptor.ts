import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { coreApi } from './core-api';

let interceptorId: number | null = null;
let unauthorizedHandler: (() => Promise<void> | void) | null = null;
let isHandlingUnauthorized = false;

const getSessionCookie = (token: string) => `better-auth.session_token=${token}`;

export const setUnauthorizedHandler = (handler: (() => Promise<void> | void) | null) => {
  unauthorizedHandler = handler;
};

coreApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && unauthorizedHandler && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;

      try {
        await unauthorizedHandler();
      } finally {
        isHandlingUnauthorized = false;
      }
    }

    return Promise.reject(error);
  }
);

const configureAxiosInterceptors = (token: string | null) => {
  if (interceptorId !== null) {
    coreApi.interceptors.request.eject(interceptorId);
  }

  interceptorId = coreApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.Cookie = getSessionCookie(token);
      } else {
        delete config.headers.Authorization;
        delete config.headers.Cookie;
      }
      return config;
    },
    (error: unknown) => {
      return Promise.reject(error);
    }
  );
};

export default configureAxiosInterceptors;
