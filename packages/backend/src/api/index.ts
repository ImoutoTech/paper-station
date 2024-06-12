import axios from 'axios';

export interface UserApiEnv {
  SSO_URL: string;
  SSO_ID: string;
  SSO_SECRET: string;
  SSO_REDIRECT: string;
}

export const UserAPI = (ENV: UserApiEnv) => {
  const getUserInfo = (token: string) => {
    return axios.get(`/oauth/user`, {
      headers: {
        Authorization: token,
      },
      baseURL: ENV.SSO_URL,
    });
  };

  const authorizeToken = (code: string) =>
    axios.post(
      '/oauth/token',
      {},
      {
        baseURL: ENV.SSO_URL,
        params: {
          client_id: ENV.SSO_ID,
          client_secret: ENV.SSO_SECRET,
          code,
          redirect_uri: ENV.SSO_REDIRECT,
        },
      },
    );

  return {
    getUserInfo,
    authorizeToken,
  };
};
